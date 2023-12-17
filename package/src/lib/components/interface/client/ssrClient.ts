import type { RequestEvent } from "@sveltejs/kit";
import type { SSRClient, Context, Route, SingleOrMultipleRoutes } from "../../types.js";
import { handleMiddlewares } from "./lib.js";
import { browser } from "$app/environment";

/**
 * Create the SSR client
 * @export
 * @template T - Type of the Router Object
 * @template U -  Type of context
 * @param {Record<string, SingleOrMultipleRoutes>} input
 * @param {?Context<U>} [createContext]
 * @param {boolean} [cacheContext=false]
 * @returns {SSRClient<T>} Fully typesafe SSR client.
 */
export  function createSSRClient<T,U>(
	input: Record<string, SingleOrMultipleRoutes>,
    createContext?: Context<U>,
	cacheContext: boolean = false
) {
    // SERVER IMPLEMENTATION
    // Copied from server.ts 
	// Regular Context with no cache
	const createNonCachedContext = () => {
		return async (event: RequestEvent) => {
			const context = createContext ? await createContext(event) : undefined;
			return context;
		};
	};
	/* Caching the createContext might be good idea to avoid called db instances upon every request*/
	const createCachedContext = () => {
		let cachedContext: U | undefined;
		return async (event: RequestEvent) => {
			if (!cachedContext) {
				cachedContext = createContext ? await createContext(event) : undefined;
			}
			return cachedContext;
		};
	};
    const getContext = cacheContext ? createCachedContext() : createNonCachedContext();
				
    // CLIENT IMPLEMENTATION
    const obj: any = {};

	for (const [key, value] of Object.entries(input)) {
		if ('method' in value && 'cb' in value && 'schema' in value) {
			obj[key] = handleClient(
				value as Route<
					(typeof obj)[typeof key][0]['input'],
					ReturnType<(typeof obj)[typeof key]['0']>,
					(typeof obj)[typeof key][0]['input']['context']
				>,getContext
			);
		} else {
			obj[key] = handleNestedClient<typeof value>(value,getContext);
		}
	}
	return obj as SSRClient<T>;
}


function handleClient<T>(input:Route<any,any,any>,getContext:(event: RequestEvent) => Promise<T | undefined>) {
	const {cb,middlewares,schema} = input;
	if (browser) {
		throw new Error("Accessing SSRClient from Browser.");
	}
	return async (event:RequestEvent,inp:Parameters<typeof cb>['0'] extends {context:unknown,input:unknown} ? Parameters<typeof cb>['0']['input'] : undefined )=>{
		const parsedInput = schema?.parse(inp);
		const obtainedContext =await getContext(event)
		const context = obtainedContext ? obtainedContext : { event };
		const middlewaredContext = await handleMiddlewares(context, middlewares);
		const result = await cb({
			input: parsedInput,
			context: middlewaredContext
		});
		return result
	}
}


function handleNestedClient<T>(input:SingleOrMultipleRoutes,getContext:(event: RequestEvent) => Promise<any>){
	const obj: any = {};
	for (const [nestedKey, value] of Object.entries(input)) {
		if ('method' in value && 'cb' in value && 'schema' in value) {
			obj[nestedKey] = handleClient(
				value as Route<
				any,any,any
				>,
				getContext
			);
		} else {
			obj[nestedKey] = handleNestedClient<typeof value>(
				value,
				getContext
			);
		}
	}

	return obj as SSRClient<T>
}
import { json, type Handle, error, type RequestEvent } from '@sveltejs/kit';
import type { SingleOrMultipleRoutes, Route, Context, Options } from '../types.js';
import { handleMiddlewares, handleOptions } from './client/lib.js';

export function createServerHandle<T>(
	input: Record<string, SingleOrMultipleRoutes>,
	routePrefiex: `/${string}`,
	createContext?: Context<T>,
	cacheContext: boolean = false
): Handle {
	// Regular Context with no cache
	const createNonCachedContext = () => {
		return async (event: RequestEvent) => {
			const context = createContext ? await createContext(event) : undefined;
			return context;
		};
	};
	/* Caching the createContext might be good idea to avoid called db instances upon every request*/
	const createCachedContext = () => {
		let cachedContext: T | undefined;
		return async (event: RequestEvent) => {
			if (!cachedContext) {
				cachedContext = createContext ? await createContext(event) : undefined;
			}
			return cachedContext;
		};
	};

	const getContext = cacheContext ? createCachedContext() : createNonCachedContext();

	return async ({ event, resolve }) => {
		const url = event.url.pathname;
		if (url.startsWith(routePrefiex)) {
			const keys = url.replace(`${routePrefiex}/`, '').split('.');
			const currentRouteObject = getCurrentObject(input, keys);
			if (!currentRouteObject) {
				throw error(404, 'Not Found');
			}
			if (event.request.method === currentRouteObject.method) {
				let data: any;
				if (currentRouteObject.method === 'GET') {
					const input = event.url.searchParams.get('input');
					data = input ? JSON.parse(decodeURIComponent(input ?? '')) : undefined;
				} else {
					data = await event.request.json();
				}

				const parsedData = currentRouteObject.schema?.parse(data);
				const obtainedContext = await getContext(event); // cachedContext
				const context = obtainedContext ? obtainedContext : { event };
				const middlewaredContext = await handleMiddlewares(context, currentRouteObject.middlewares);
				const result = await currentRouteObject.cb({
					input: parsedData,
					context: middlewaredContext
				});
				//handling custom headers and options
				const headers = handleOptions(currentRouteObject.options);

				//Return json
				return json(
					{ output: result },
					{
						headers
					}
				);
			} else {
				throw error(405);
			}
		}
		return await resolve(event);
	};
}

function getCurrentObject(obj: Record<string, SingleOrMultipleRoutes>, keys: string[]) {
	if (keys.length <= 0) {
		return undefined;
	}
	let currentObj: SingleOrMultipleRoutes | Route<any, any, any> | undefined = obj[keys.shift()!];
	for (const key of keys) {
		if (currentObj && typeof currentObj === 'object' && key in currentObj) {
			currentObj = currentObj?.[key as keyof typeof currentObj] as
				| SingleOrMultipleRoutes
				| undefined;
		} else {
			return undefined;
		}
	}
	if (currentObj && 'cb' in currentObj && 'method' in currentObj && 'schema' in currentObj) {
		return currentObj as Route<any, any, any>;
	} else {
		return undefined;
	}
}


import { json, type Handle, error, type RequestEvent } from '@sveltejs/kit';
import type { SingleOrMultipleRoutes, Route, ContextFn, ServerClient } from '../types.js';
import { ZodError } from 'zod';
/**
 * Creates a SSR router based on the provided options.
 *
 * @param {Object} opts - Options object containing router details and URL.
 * @param {Record<string, SingleOrMultipleRoutes>} opts.router - The router object used to define custom routes.
 * @param {`/${string}`} opts.url - The URL path for SSR routes.
 * @returns {ServerClient<T>} - Server client object with defined routes.
 * @template T - The generic type parameter for the SSR router.
 * @typedef {Record<string, any> | SingleOrMultipleRoutes} SingleOrMultipleRoutes - Represents a single or multiple routes.
 */

export function createRestSSR<T>(opts: {
	router: Record<string, SingleOrMultipleRoutes>;
	url: `/${string}`;
}) {
	return (event: RequestEvent) => {
		const obj: any = {};
		const { router, url } = opts;
		// console.log(`Router object from ${router.route1}`);
		for (const [key, value] of Object.entries(router)) {
			if ('method' in value && 'cb' in value) {
				obj[key] = handleSSR(
					value as Route<
						(typeof obj)[typeof key][0]['input'],
						ReturnType<(typeof obj)[typeof key]['0']>,
						(typeof obj)[typeof key][0]['input']['context']
					>,
					key,
					url,
					event
				);
			}
		}
		return obj as ServerClient<T>; // Need to be typed
	};
}

function handleSSR(
	route: Route<any, any, any>,
	key: string,
	url: `/${string}`,
	{ fetch }: RequestEvent
) {
	const { cb, method, schema } = route;

	return async (
		inp: Parameters<typeof cb>['0'] extends { context: unknown; input: unknown }
			? Parameters<typeof cb>['0']['input']
			: undefined
	) => {
		let request: Promise<Response>;
		const parsedInput = schema?.parse(inp);
		if (method === 'GET') {
			const jsonified = JSON.stringify(parsedInput);
			const Url = `${url}/${key}${
				parsedInput !== undefined ? `?input=${encodeURIComponent(jsonified)}` : ''
			}`;

			request = fetch(Url);
		} else {
			const Url = `${url}/${key}`;
			request = fetch(Url, {
				method,
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(parsedInput)
			});
		}

		try {
			const response = await (await request).json();
			return response;
		} catch (error) {
			console.log('error');
		}
	};
}

export function createServerHandle<T>(
	input: Record<string, SingleOrMultipleRoutes>,
	routePrefiex: `/${string}`,
	createContext?: ContextFn<T>
): Handle {
	/* Caching the createContext might be good idea to avoid called db instances upon every request*/

	const createCachedContext = () => {
		let cachedContext: T | undefined;

		return async (event: RequestEvent) => {
			if (!cachedContext) {
				cachedContext = createContext ? await createContext(event) : undefined;
				if (cachedContext instanceof Promise) {
					console.log('Context is promise type');
					cachedContext
						.then((val) => {
							cachedContext = val;
						})
						.catch((err) => console.log(err));
				}
			}
			return cachedContext;
		};
	};

	const getContext = createCachedContext();

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
				try {
					const parsedData = currentRouteObject.schema?.parse(data);
					console.log('Here', data);
					const cachedContext = getContext ? await getContext(event) : undefined; // cachedContext
					const context = cachedContext ? cachedContext : { event };
					const middlewaredContext = await handleMiddlewares(
						context,
						currentRouteObject.middlewares
					);
					const result = await currentRouteObject.cb({
						input: parsedData,
						context: middlewaredContext
					});
					return json(result);
				} catch (error) {
					if (error instanceof ZodError) {
						console.log('ZOD error');
						const flattenedError = error.flatten();
						if (flattenedError.formErrors.length === 0 && flattenedError.fieldErrors) {
							return json({
								error: {
									code: 'BAD REQUEST',
									message: JSON.stringify(flattenedError.fieldErrors),
									path: url,
									input: data
								}
							});
						} // TODO: Need to implement for form errors too if needed
					}
				}
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
	if (currentObj && 'cb' in currentObj && 'method' in currentObj) {
		return currentObj as Route<any, any, any>;
	} else {
		return undefined;
	}
}

async function handleMiddlewares(currentContext: any, middlewares: ((...inp: any) => any)[]) {
	let context = { ...currentContext };
	for (const middleware of middlewares) {
		const result = await middleware({ context });
		context = { ...context, ...result };
	}
	return context;
}

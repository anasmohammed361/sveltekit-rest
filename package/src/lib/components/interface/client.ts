import { readable, readonly, writable, type Writable } from 'svelte/store';
import type { Client, Route, Router, SingleOrMultipleRoutes, TCache, TOutput } from '../types.js';

const cache = new Map<string, TCache>();

/**
 *
 * @template T - Type of the router object for the client
 * @param {Router} router - The router object used to define your custom routes.
 * @param {`/string`} routePrefix - The prefix for routes defaults to `/api`
 * @returns {Client<T>} - Returns a client object with defined routes as Readable stores.
 */

export function createClient<T>(router: Router, routePrefix: `/${string}`) {
	const obj: any = {};

	for (const [key, value] of Object.entries(router)) {
		if ('method' in value && 'cb' in value) {
			obj[key] = handleClient(
				value as Route<
					(typeof obj)[typeof key][0]['router'],
					ReturnType<(typeof obj)[typeof key]['0']>,
					(typeof obj)[typeof key][0]['router']['context']
				>,
				key,
				routePrefix
			);
		} else {
			obj[key] = handleNestedClient<typeof value>(value, key, routePrefix);
		}
	}
	return obj as Client<T>;
}

function handleNestedClient<T>(
	input: SingleOrMultipleRoutes,
	key: string,
	routePrefix: `/${string}`
) {
	const obj: any = {};
	for (const [nestedKey, value] of Object.entries(input)) {
		if ('method' in value && 'cb' in value) {
			type T = (typeof obj)[typeof key]['0']['input'];
			type U = ReturnType<(typeof obj)[typeof key]['0']>;
			type Ttop = (typeof obj)[typeof key][0]['input']['context'];

			obj[nestedKey] = handleClient<T, U, Ttop>(
				value as Route<T, U, Ttop>,
				`${key}.${nestedKey}`,
				routePrefix
			);
		} else {
			obj[nestedKey] = handleNestedClient<(typeof obj)[typeof key]>(
				value,
				`${key}.${nestedKey}`,
				routePrefix
			);
		}
	}

	return obj as Client<T>;
}

/**
 * @template T - Router object type
 * @template U - Return type of Endpoint callback functions.
 * @template Ttop - Type of context.
 * @param {Route<T, U, Ttop>} route - Single respective route from router object.
 * @param {string} key
 * @param {string} routePrefix
 * @returns {Readable<TOutput<T>>} - Returns a readable store representing the client with defined routes.
 * @typedef {Object} Readable<TOutput<T>> - Represents a readable store with defined routes.
 * @property {boolean} isLoading - Indicates if the client is currently loading.
 * @property {boolean} isError - Indicates if an error occurred while processing the request.
 * @property {boolean} isSettled - Indicates if the client has settled after a request.
 * @property {any} [data] - Data received from the request.
 * @property {Function} [refetch] - Function to trigger a manual data refetch.
 * @callback TOutput<T> {isLoading, isError, isSetteled, data?}
 */

function handleClient<T, U, Ttop>(
	route: Route<T, U, Ttop>,
	key: string,
	routePrefix: `/${string}`
) {
	const { cb } = route;

	return (
		inp: Parameters<typeof cb>['0'] extends { context: unknown; route: unknown }
			? Parameters<typeof cb>['0']['route']
			: undefined,
		staleTime: number = 5 * 60 * 1000
	) => {
		const initialStoreValue: TOutput<typeof route> = {
			isError: false,
			isLoading: false,
			isSetteled: false,
			refetch: async () => {
				return await resolveRequest<T, U, Ttop>(
					route,
					key,
					routePrefix,
					inp,
					writableStore,
					staleTime
				);
			}
		};
		const writableStore: Writable<typeof initialStoreValue> =
			writable<typeof initialStoreValue>(initialStoreValue);

		if (cache.has(key)) {
			const currentCache = cache.get(key);
			const time = new Date().getTime();
			if (currentCache) {
				if (time - currentCache.lastTime > 3 * 60 * 100) {
					cache.delete(key);
				}
				if (
					time <= currentCache.staleTime &&
					!(time - currentCache.lastTime > 3 * 60 * 100)
				) {
					currentCache.lastTime = time;

					return readable<TOutput<typeof route>>(undefined, (set, update) => {
						set(initialStoreValue);

						writableStore.subscribe((value) => {
							update((_) => value);
						});
					});
				}
			}
		}

		resolveRequest<T, U, Ttop>(route, key, routePrefix, inp, writableStore, staleTime);

		return readable<TOutput<typeof route>>(undefined, (set, update) => {
			set(initialStoreValue);

			writableStore.subscribe((value) => {
				update((_) => value);
			});
		});
	};
}

async function resolveRequest<T, U, Ttop>(
	route: Route<T, U, Ttop>,
	key: string,
	routePrefix: `/${string}`,
	inp: any,
	writableStore: Writable<TOutput<typeof route>>,
	staleTime: number
): Promise<U | undefined> {
	const { method, schema } = route;
	let request: Promise<Response>;
	const parsedInput = schema?.parse(inp);
	// Fallback for ssr
	if (typeof window === 'undefined') return; //
	// Loading the request
	writableStore.update((value) => {
		value.isLoading = true;
		value.isError = false;
		value.isSetteled = false;
		return value;
	});
	if (method === 'GET') {
		const jsonified = JSON.stringify(parsedInput);
		const url = `${routePrefix}/${key}${
			parsedInput !== undefined ? `?input=${encodeURIComponent(jsonified)}` : ''
		}`;
		request = fetch(url);
	} else {
		// TODO: Implement the cache logic
		request = fetch(`${routePrefix}/${key}`, {
			method,
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(parsedInput)
		});
	}

	const response = await (await request).json();
	if (!('error' in response)) {
		const currentTime = new Date().getTime();
		writableStore.update((value) => {
			value.isLoading = false;
			value.isSetteled = true;
			value.data = response;
			return value;
		});
		cache.set(key, {
			lastTime: currentTime,
			staleTime: currentTime + staleTime,
			data: response
		});
		return response;
	} else {
		writableStore.update((value) => {
			value.isError = true;
			value.isLoading = false;
			value.isSetteled = false;
			value.error = response.error;
			return value;
		});
		if (cache.has(key)) cache.delete(key);
		// throw new Error(await response.text());
	}
}

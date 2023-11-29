import { json, type Handle, error } from '@sveltejs/kit';
import type { ClientServer, PerRoute, RecordValue } from './types.js';

export function generateServer(input: ClientServer, routePrefiex: `/${string}`): Handle {
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

				const result = await currentRouteObject.cb({ input: parsedData, context: event });
				return json({ output: result });
			} else {
				throw error(405);
			}
		}
		return await resolve(event);
	};
}

function getCurrentObject(obj: ClientServer, keys: string[]) { 
	if (keys.length <= 0) {
		return undefined;
	}
	let currentObj: RecordValue | PerRoute | undefined = obj[keys.shift()!];
	for (const key of keys) {
		if (currentObj && typeof currentObj === 'object' && key in currentObj) {
			currentObj = currentObj?.[key as keyof typeof currentObj] as RecordValue | undefined;
		} else {
			return undefined;
		}
	}
	if (currentObj && 'cb' in currentObj && 'method' in currentObj) {
		return currentObj as PerRoute;
	} else {
		return undefined;
	}
}

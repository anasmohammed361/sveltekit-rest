import type { z } from 'zod';
import { json, type Handle, error } from '@sveltejs/kit';

export function generateServer(
	input: Record<
		string,
		{
			method: string;
			cb: (inp: any) => any;
			schema?: z.ZodSchema;
		}
	>,
	routePrefiex: `/${string}` = '/api'
): Handle {
	const routes = Object.keys(input).map((elem) => `${routePrefiex}/${elem}`);
	return async ({ event, resolve }) => {
		const currentUrl = event.url.pathname;
		if (routes.includes(currentUrl)) {
			const urlList = currentUrl.split('/');
			const currentRouteObject = input[urlList[urlList.length - 1]];

			if (event.request.method === currentRouteObject.method) {
				let data: any;
				if (currentRouteObject.method === 'GET') {
					const input = event.url.searchParams.get('input');
					data = input ? JSON.parse(decodeURIComponent(input ?? '')) : undefined;
				} else {
					data = await event.request.json();
				}
				const parsedData = currentRouteObject.schema?.parse(data);

				const result = await currentRouteObject.cb(parsedData);
				return json({ output: result });
			} else {
				throw error(405);
			}
		}
		return await resolve(event);
	};
}

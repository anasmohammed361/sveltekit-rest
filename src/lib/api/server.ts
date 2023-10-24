type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

import type { RequestHandler, RequestEvent } from '@sveltejs/kit';
import type { z } from 'zod';

type route<B, Q, T> = {
	query: z.ZodSchema<Q>;
	body?: z.ZodSchema<B>;
	method: HttpMethod;
	invoke: (input: Q) => T;
};

export class API {
	private routes: Record<string, route<any, any, any>> = {};
	router<B, Q, T>(routes: Record<string, route<B, Q, T>>) {
		this.routes = { ...this.routes, ...routes };
		return this;
	}
	addRoute<B, Q, T>(key: string, value: route<B, Q, T>) {
		this.routes[key] = value;
	}
	async createServer(
		route: string,
		{ request, url }: RequestEvent
	): Promise<RequestHandler | undefined> {
		if (route in Object.keys(this.routes)) {
			const currentRoute = this.routes[route];
			if (currentRoute.method === "GET") {
				console.log(url.searchParams);
			}
			const body = await request.json();
			// currentRoute!.body.parse(body);
			console.log(body);
			return;
		}
	}
}

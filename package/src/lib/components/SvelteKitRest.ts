import { z } from 'zod';
import type { Route, RouteMethod } from './types.js';
import type { RequestEvent } from '@sveltejs/kit';
type Options = {
	contentType: string;
	headers: {
		client: Record<string, string>;
		server: Record<string, string>;
	};
};

class SvelteKitREST {
	public get;
	public post;
	public put;
	public delete;
	constructor() {
		const router = this.getRouter<undefined>(z.undefined());
		this.get = router.get;
		this.post = router.post;
		this.put = router.put;
		this.delete = router.delete;
	}
	input<U>(inp: z.ZodSchema<U>) {
		return this.getRouter<U>(inp);
	}
	private getRouter<T>(schema: z.ZodSchema<T>) {
		return {
			get: <U>(cb: (inp: { context: { event: RequestEvent }; input: T }) => U): Route<T, U>=> {
				return {
					method: 'GET',
					cb,
					schema: schema
				};
			},

			post: <U>(cb: (inp: { context: { event: RequestEvent }; input: T }) => U):Route<T, U> => {
				return {
					method: 'POST',
					cb,
					schema: schema
				};
			},
			put: <U>(cb: (inp: { context: { event: RequestEvent }; input: T }) => U):Route<T, U> => {
				return {
					method: 'PUT',
					cb,
					schema: schema
				};
			},
			patch: <U>(cb: (inp: { context: { event: RequestEvent }; input: T }) => U): Route<T, U> => {
				return {
					method: 'PATCH',
					cb,
					schema: schema
				};
			},
			delete: <U>(cb: (inp: { context: { event: RequestEvent }; input: T }) => U): Route<T, U> => {
				return {
					method: 'DELETE',
					cb,
					schema: schema
				};
			}
		};
	}
}

export function initSveltekitRest() {
	return new SvelteKitREST();
}

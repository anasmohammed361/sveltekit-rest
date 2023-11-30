import { z } from 'zod';
import type { Route, RouteMethod, RouteMethodInput } from './types.js';

type Options = {
	contentType: string;
	headers: {
		client: Record<string, string>;
		server: Record<string, string>;
	};
};

class SvelteKitREST {
	public get: RouteMethod<undefined>;
	public post: RouteMethod<undefined>;
	public put: RouteMethod<undefined>;
	public delete: RouteMethod<undefined>;
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
			get: <U>(cb: (inp: RouteMethodInput<T>) => U): Route => {
				return {
					method: 'GET',
					cb,
					schema: schema
				};
			},

			post: <U>(cb: (inp: RouteMethodInput<T>) => U): Route => {
				return {
					method: 'POST',
					cb,
					schema: schema
				};
			},
			put: <U>(cb: (inp: RouteMethodInput<T>) => U): Route => {
				return {
					method: 'PUT',
					cb,
					schema: schema
				};
			},
			patch: <U>(cb: (inp: RouteMethodInput<T>) => U): Route => {
				return {
					method: 'PATCH',
					cb,
					schema: schema
				};
			},
			delete: <U>(cb: (inp: RouteMethodInput<T>) => U): Route => {
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
	return new SvelteKitREST()
}
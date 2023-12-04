import type { z } from 'zod';
import type { Route, RouteMethod, Params, TContext, CombineTypes } from './types.js';
import type { RequestEvent } from '@sveltejs/kit';
type Options = {
	contentType: string;
	headers: {
		client: Record<string, string>;
		server: Record<string, string>;
	};
};
class SvelteKitREST<Ttop = undefined> {
	public get;
	public post;
	public put;
	public delete;
	private middlewares: ((inp: {}) => any)[] = [];
	private constructor() {
		const router = this.getRouter<undefined>();
		this.get = router.get;
		this.post = router.post;
		this.put = router.put;
		this.delete = router.delete;
	}
	static init<T = undefined>() {
		return new SvelteKitREST<T>();
	}
	private static getMiddlewareInstance<T>(
		existingMiddlewares: ((inp: {}) => any)[],
		currentMiddleware: (inp: any) => any
	) {
		const instance = new SvelteKitREST<T>();
		instance.middlewares = [...existingMiddlewares, currentMiddleware];
		return instance;
	}

	input<U>(inp: z.ZodSchema<U>) {
		return this.getRouter<U>(inp);
	}

	middleware<U>(func: (inp: { context: TContext<Ttop> }) => U) {
		const middlewares = this.middlewares;
		return SvelteKitREST.getMiddlewareInstance<CombineTypes<TContext<Ttop>,Awaited<U>>>(middlewares, func);
	}

	private getRouter<T>(schema?: z.ZodSchema<T>) {
		return {
			get: <U>(cb: (inp: Params<T, Ttop>) => U): Route<T, U, Ttop> => {
				return {
					method: 'GET',
					cb,
					schema: schema,
					middlewares:this.middlewares
				};
			},

			post: <U>(cb: (inp: Params<T, Ttop>) => U): Route<T, U, Ttop> => {
				return {
					method: 'POST',
					cb,
					schema: schema,
					middlewares:this.middlewares
				};
			},
			put: <U>(cb: (inp: Params<T, Ttop>) => U): Route<T, U, Ttop> => {
				return {
					method: 'PUT',
					cb,
					schema: schema,
					middlewares:this.middlewares
				};
			},
			patch: <U>(cb: (inp: Params<T, Ttop>) => U): Route<T, U, Ttop> => {
				return {
					method: 'PATCH',
					cb,
					schema: schema,
					middlewares:this.middlewares
				};
			},
			delete: <U>(cb: (inp: Params<T, Ttop>) => U): Route<T, U, Ttop> => {
				return {
					method: 'DELETE',
					cb,
					schema: schema,
					middlewares:this.middlewares
				};
			}
		};
	}
}

export const initSveltekitRest = {
	withContext: <T>(): { create: () => SvelteKitREST<T> } => ({
		create: () => SvelteKitREST.init<T>()
	}),
	create: (): SvelteKitREST<undefined> => {
		return SvelteKitREST.init();
	}
};

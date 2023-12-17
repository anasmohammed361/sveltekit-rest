import type { z } from 'zod';
import type { Route, Params, TContext, CombineTypes,Options } from './types.js';

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

	middleware<U extends Record<string,any>>(func: (inp: { context: TContext<Ttop> }) => U) {
		const middlewares = this.middlewares;
		return SvelteKitREST.getMiddlewareInstance<CombineTypes<TContext<Ttop>,Awaited<U>>>(middlewares, func);
	}

	private getRouter<T>(schema?: z.ZodSchema<T>) {
		return {
			get: <U>(cb: (inp: Params<T, Ttop>) => U,options?:Partial<Options>): Route<T, U, Ttop> => {
				return {
					method: 'GET',
					cb,
					schema: schema,
					middlewares:this.middlewares,
					options
				};
			},

			post: <U>(cb: (inp: Params<T, Ttop>) => U,options?:Partial<Options>): Route<T, U, Ttop> => {
				return {
					method: 'POST',
					cb,
					schema: schema,
					middlewares:this.middlewares,
					options
				};
			},
			put: <U>(cb: (inp: Params<T, Ttop>) => U,options?:Partial<Options>): Route<T, U, Ttop> => {
				return {
					method: 'PUT',
					cb,
					schema: schema,
					middlewares:this.middlewares,
					options
				};
			},
			patch: <U>(cb: (inp: Params<T, Ttop>) => U,options?:Partial<Options>): Route<T, U, Ttop> => {
				return {
					method: 'PATCH',
					cb,
					schema: schema,
					middlewares:this.middlewares,
					options
				};
			},
			delete: <U>(cb: (inp: Params<T, Ttop>) => U,options?:Partial<Options>): Route<T, U, Ttop> => {
				return {
					method: 'DELETE',
					cb,
					schema: schema,
					middlewares:this.middlewares,
					options
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

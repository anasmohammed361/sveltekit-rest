import type { z } from 'zod';
import type { Route, Params, TContext, CombineTypes,Options } from './types.js';

/**
 * Represents a REST API handler for SvelteKitREST.
 * @class
 * @template Ttop - Represents the top-level context, defaulting to undefined.
 */
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
	  /**
   * Initializes an instance of SvelteKitREST.
   * @static
   * @template T - Represents the context type, defaulting to undefined.
   * @returns {SvelteKitREST<T>} An instance of SvelteKitREST.
   */
	static init<T = undefined>(): SvelteKitREST<T> {
		return new SvelteKitREST<T>();
	}

	 /**
   * Creates a new middleware instance for the SvelteKitREST.
   * @private
   * @static
   * @template U - Represents the middleware's return type.
   * @param {((inp: { context: TContext<Ttop> }) => U)} func - The middleware function.
   * @returns {SvelteKitREST<CombineTypes<TContext<Ttop>, Awaited<U>>>} A new instance with added middleware.
   */
	private static getMiddlewareInstance<T>(
		existingMiddlewares: ((inp: {}) => any)[],
		currentMiddleware: (inp: any) => any
	) {
		const instance = new SvelteKitREST<T>();
		instance.middlewares = [...existingMiddlewares, currentMiddleware];
		return instance;
	}
 /**
   * Sets the input schema for the router.
   * @template U - Represents the input schema type.
   * @param {z.ZodSchema<U>} inp - The Zod schema for input validation.
   * @returns HTTP methods with properly Validated inputs with Zod.
   */
	input<U>(inp: z.ZodSchema<U>) {
		return this.getRouter<U>(inp);
	}

 /**
   * Adds middleware to the SvelteKitREST instance.
   * @template U - Represents the middleware's context type.
   * @param {(inp: { context: TContext<Ttop> }) => U} func - The middleware function.
   * @returns {SvelteKitREST<CombineTypes<TContext<Ttop>, Awaited<U>>>} A new instance with added middleware.
   */
	middleware<U extends Record<string,any>>(func: (inp: { context: TContext<Ttop> }) => U) {
		const middlewares = this.middlewares;
		return SvelteKitREST.getMiddlewareInstance<CombineTypes<TContext<Ttop>,Awaited<U>>>(middlewares, func);
	}

	/**
	 * Returns HTTP endpoints with annotated inputs
	 * @private
	 * @template T
	 * @param {?z.ZodSchema<T>} [schema]
	 * @returns {{ get: <U>(cb: (inp: Params<T, Ttop>) => U, options?: Partial<Options>) => Route<T, U, Ttop>; post: <U>(cb: (inp: Params<T, Ttop>) => U, options?: Partial<Options>) => Route<T, U, Ttop>; put: <U>(cb: (inp: Params<...>) => U, options?: Partial<...>) => Route<...>; patch: <U>(cb: (inp: ...}
	 */
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

/**
 * Instantiate SveltekitREST with or without Context
 *@template T context Type
 * @type {{ withContext: <T>() => { create: () => SvelteKitREST<T>; }; create: () => SvelteKitREST<undefined>; }}
 */
export const initSveltekitRest = {
	withContext: <T>(): { create: () => SvelteKitREST<T> } => ({
		create: () => SvelteKitREST.init<T>()
	}),
	create: (): SvelteKitREST<undefined> => {
		return SvelteKitREST.init();
	}
};

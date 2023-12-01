import type { RequestEvent } from '@sveltejs/kit';
import type { ResolvedUrl } from 'vite';
import type { z } from 'zod';
type Route<T, U, Ttop> = {
	method: string;
	cb: (inp: { input: T; context: Ttop extends undefined ? { event: RequestEvent } : Ttop }) => U;
	schema: z.ZodSchema | undefined;
};
// type Route1<T, U, Ttop> = {
// 	method: string;
// 	cb: (inp: { input: T; context: Ttop extends undefined ? { event: RequestEvent } : Ttop }) => U;
// 	schema: z.ZodSchema | undefined;
// };
type SingleOrMultipleRoutes = Route<any, any, any> | Record<string, Route>;

// type Router = Record<string, SingleOrMultipleRoutes>;
type NotNullParams<T> = T extends undefined ? [] : [T];
type Client<T> = {
	[K in keyof T]: T[K] extends {
		cb: (inp: { input: infer M; context: { event: RequestEvent } }) => infer U;
	}
		? (...input: NotNullParams<M>) => Promise<Awaited<U>>
		: T[K] extends Record<string, Route>
		  ? Client<T[K]>
		  : never;
};

type RouteMethod<T> = <U>(cb: (inp: RouteMethodInput<T>) => U) => Route;

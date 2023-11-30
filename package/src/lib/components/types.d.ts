import type { RequestEvent } from '@sveltejs/kit';
import type { ResolvedUrl } from 'vite';
import type { z } from 'zod';
type Route = {
	method: string;
	cb: (inp: any) => any;
	schema: z.ZodSchema | undefined;
};
type SingleOrMultipleRoutes = Route | Record<string, Route>;

type Router = Record<string, SingleOrMultipleRoutes>;
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

type RouteMethodInput<T> = T extends undefined
	? { context: { event: RequestEvent } }
	: { context: { event: RequestEvent }; input: T };
type RouteMethod<T> = <U>(cb: (inp: RouteMethodInput<T>) => U) => Route;

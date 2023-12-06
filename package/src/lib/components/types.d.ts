import type { RequestEvent } from '@sveltejs/kit';
import type { Readable } from 'svelte/store';
import type { ResolvedUrl } from 'vite';
import type { z } from 'zod';

type TContext<T> = T extends undefined ? { event: RequestEvent } : ContextReturnType<T>;

type Params<T, U> = T extends undefined
	? { context: TContext<U> }
	: { context: TContext<U>; input: T };
type Route<T, U, Ttop> = {
	method: string;
	cb: (inp: Params<T, Ttop>) => U;
	schema: z.ZodSchema | undefined;
	middlewares: ((...inp: any) => any)[];
};
type ServerClient<T> = {
	[K in keyof T]: T[K] extends {
		cb: (inp: infer M) => U;
	}
		? (...input: NotNullParams<M>) => Promise<U>
		: T[K] extends Record<string, Route>
		  ? ServerClient<T[K]>
		  : never;
};

type Router = Record<string, SingleOrMultipleRoutes>;

type SingleOrMultipleRoutes = Route<any, any, any> | Record<string, Route>;
type TError = {
	code: string;
	message: string;
	path: string;
	input?: string;
}
type TOutput<T> = T extends { cb: (inp: infer M) => infer U }
	? {
			isLoading: boolean;
			isError: boolean;
			isSetteled: boolean;
			data?: Awaited<U>;
			error?: TError;
			refetch: () => Promise<U | undefined> = () => {};
	  }
	: never;

type NotNullParams<T> = T extends { input: infer M } ? (M extends undefined ? [] : [M]) : [];
type Client<T> = {
	[K in keyof T]: T[K] extends {
		cb: (inp: infer M) => infer U;
	}
		? (...input: NotNullParams<M>) => Readable<TOutput<T[K]>>
		: T[K] extends Record<string, Route>
		  ? Client<T[K]>
		  : never;
};

type RouteMethod<T> = <U>(cb: (inp: RouteMethodInput<T>) => U) => Route;

type ContextFn<T> = (event: RequestEvent) => T | Promise<T>;

type ContextReturnType<T> = T extends (...args: any[]) => infer R ? Awaited<R> : T;

type CombineTypes<A, B> = {
	[K in keyof A]: K extends keyof B ? B[K] : A[K];
} & B;

type TCache = {
	lastTime: number;
	staleTime: number;
	data?: any;
};

import type { RequestEvent } from '@sveltejs/kit';
import type { z } from 'zod';
export type PerRoute={
    method: string;
    cb: (inp: any) => any;
    schema?: z.ZodSchema;
}
export type RecordValue = PerRoute|Record<string,PerRoute>

export type ClientServer = Record<
	string,
    RecordValue
>;
type NotNullParams<T> = T extends undefined ? [] : [T]

export type Client<T> = {
	[K in keyof T]: T[K] extends { cb: (inp:{input:infer M , context: RequestEvent}) => infer U }
		? (...input:NotNullParams<M>)=>U
		: (T[K] extends Record<string,PerRoute> ? Client<T[K]> : never);
};
import type { z } from 'zod';
type PerRoute={
    method: string;
    cb: (inp: any) => any;
    schema?: z.ZodSchema;
}
type RecordValue = PerRoute|Record<string,PerRoute>

export type ClientServer = Record<
	string,
    PerRoute
>;

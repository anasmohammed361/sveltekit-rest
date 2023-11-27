import type { z } from 'zod';
import type { RequestEvent } from '@sveltejs/kit';
type Params<T> = T extends undefined ? [] : [T];
export class SvelteKitREST<T = undefined> {
	schema: z.ZodSchema<T> | undefined;
	constructor(inpSchema?: z.ZodSchema<T>) {
		if (inpSchema) {
			this.schema = inpSchema;
		}
	}

	input<U>(inp: z.ZodSchema<U>) {
		return new SvelteKitREST<U>(inp);
	}

	get<U>(cb: (inp:{input:T,context:RequestEvent}) => U) {
		return {
			method: 'GET',
			cb,
			schema: this.schema
		};
	}

	post<U>(cb: (inp:{input:T,context:RequestEvent}) => U) {
		return {
			method: 'POST',
			cb,
			schema: this.schema
		};
	}
	put<U>(cb: (inp:{input:T,context:RequestEvent}) => U) {
		return {
			method: 'PUT',
			cb,
			schema: this.schema
		};
	}
	patch<U>(cb: (inp:{input:T,context:RequestEvent}) => U) {
		return {
			method: 'PATCH',
			cb,
			schema: this.schema
		};
	}
	delete<U>(cb: (inp:{input:T,context:RequestEvent}) => U) {
		return {
			method: 'DELETE',
			cb,
			schema: this.schema
		};
	}
}

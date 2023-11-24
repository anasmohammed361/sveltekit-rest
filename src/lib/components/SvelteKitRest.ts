import type { z } from 'zod';

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

	get<U>(cb: (inp: T) => U) {
		return {
			method: 'GET',
			cb,
			schema: this.schema
		};
	}

	post<U>(cb: (inp: T) => U) {
		return {
			method: 'POST',
			cb,
			schema: this.schema
		};
	}
	put<U>(cb: (inp: T) => U) {
		return {
			method: 'PUT',
			cb,
			schema: this.schema
		};
	}
	patch<U>(cb: (inp: T) => U) {
		return {
			method: 'PATCH',
			cb,
			schema: this.schema
		};
	}
	delete<U>(cb: (inp: T) => U) {
		return {
			method: 'DELETE',
			cb,
			schema: this.schema
		};
	}
}

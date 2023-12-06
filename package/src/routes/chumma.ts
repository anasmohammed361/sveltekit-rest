import { createRESTInterface, initSveltekitRest } from '$lib/index.js';
import type { RequestEvent } from '@sveltejs/kit';
import { z } from 'zod';

export function context(event: RequestEvent) {
	return {
		name: 'HI',
		user: 'Admin'
	};
}

const r = initSveltekitRest.withContext<typeof context>().create();

const admin = r.middleware(({ context }) => {
	if (context.user === 'Admin') {
		return {
			...context,
			isAdmin: true
		};
	}
});
export const router = {
	users: admin.input(z.object({ name: z.string() })).get(async ({ context, input }) => {
		console.log(context.isAdmin);
		await new Promise((res) => {
			setTimeout(res, 3000);
		});
		return {
			name: input.name,
			age: 20
		};
	})
};

export const { client, RestHandle } = createRESTInterface<typeof router>(router, {
	createContext: context
});

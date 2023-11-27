import { SvelteKitREST, generateClient } from '$lib/index';
import { z } from 'zod';

const rest = new SvelteKitREST();

export const router = {
	hi: rest.input(z.object({ from: z.string() })).get(({ input, context }) => {
		console.log('Input is ' + input.name);
		return input;
	})
};

export const client = generateClient<typeof router>(router);

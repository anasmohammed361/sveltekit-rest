import { createRESTInterface, initSveltekitRest } from '$lib/index.js';
import type { RequestEvent } from '@sveltejs/kit';
import { z } from 'zod';

export async function chumma(e: RequestEvent) {
	return {
		hi: 'HI'
	};
}

type Context = ReturnType<typeof chumma>;

const r = initSveltekitRest.withContext<Context>().create();

export const router = {
	user: r.get(({ context }) => {
		
	})
};

export const { client, serverHook } = createRESTInterface<typeof router, Context>(router, chumma);

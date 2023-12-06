import { rest } from '$lib/sever/restSSR.js';
import type { RequestEvent } from '@sveltejs/kit';

export const load: PageSeverLoad = async (e: RequestEvent) => {
	const data = rest(e).users({ name: 'Kirthevasen' });

	return {
		data: data,
		users: {
			chumma: data
		}
	};
};

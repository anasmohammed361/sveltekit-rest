import type { Handle } from '@sveltejs/kit';
import { generateServer } from '$lib/index.js';
import { router } from './routes/thisx.js';
export const handle: Handle = generateServer(router);

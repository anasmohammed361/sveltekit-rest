import type { Handle } from '@sveltejs/kit';
import { RestHandle } from './routes/chumma.js';

export const handle: Handle = RestHandle;

import { createRestSSR } from '$lib/components/interface/server.js';
import { router } from '../../routes/chumma.js';
export const rest = createRestSSR<typeof router>({ router, url: '/api' });

import { generateClient } from './client.js';
import { generateServer } from './server.js';
import type { ClientServer } from './types.js';

export function generateREST<T>(input: ClientServer, routePrefiex: `/${string}` = '/api') {
	return {
		client: generateClient<T>(input, routePrefiex),
		server: generateServer(input, routePrefiex)
	};
}

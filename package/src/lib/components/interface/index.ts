import type { SingleOrMultipleRoutes } from '../types.js';
import { createClient } from './client.js';
import { createServerHandle } from './server.js';

export function createRESTInterface<T>(input: Record<string,SingleOrMultipleRoutes>, routePrefiex: `/${string}` = '/api') {
	return {
		client: createClient<T>(input, routePrefiex),
		serverHook: createServerHandle(input, routePrefiex)
	};
}
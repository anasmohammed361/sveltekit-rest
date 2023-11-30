import { createClient } from './client.js';
import { createServerHandle } from './server.js';
import type { Router } from '../types.js';

export function createRESTInterface<T>(input: Router, routePrefiex: `/${string}` = '/api') {
	return {
		client: createClient<T>(input, routePrefiex),
		serverHook: createServerHandle(input, routePrefiex)
	};
}
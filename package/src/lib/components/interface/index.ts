import type { RequestEvent } from '@sveltejs/kit';
import type { SingleOrMultipleRoutes } from '../types.js';
import { createClient } from './client.js';
import { createServerHandle } from './server.js';

export function createRESTInterface<T,U>(input: Record<string,SingleOrMultipleRoutes>, createContext?: (event: RequestEvent) => U , routePrefiex: `/${string}` = '/api') {
	return {
		client: createClient<T>(input, routePrefiex),
		serverHook: createServerHandle<U>(input,routePrefiex,createContext) // createContext makes user to use db on routes.
	};
}
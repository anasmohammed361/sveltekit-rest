import type { RequestEvent } from '@sveltejs/kit';
import type { SingleOrMultipleRoutes } from '../types.js';
import { createClient } from './client.js';
import { createServerHandle } from './server.js';

export function createRESTInterface<T>(input: Record<string,SingleOrMultipleRoutes>, createContext: (event: RequestEvent) => object | undefined,routePrefiex: `/${string}` = '/api') {
	return {
		client: createClient<T>(input, routePrefiex),
		serverHook: createServerHandle(input, createContext,routePrefiex) // createContext makes user to use db on routes.
	};
}
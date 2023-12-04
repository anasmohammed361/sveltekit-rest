import type { RequestEvent } from '@sveltejs/kit';
import type { Context, SingleOrMultipleRoutes } from '../types.js';
import { createClient } from './client.js';
import { createServerHandle } from './server.js';

export function createRESTInterface<T>(input: Record<string,SingleOrMultipleRoutes>, createContext?:Context<any> , routePrefiex: `/${string}` = '/api') {
	return {
		client: createClient<T>(input, routePrefiex),
		serverHook: createServerHandle<any>(input,routePrefiex,createContext) // createContext makes user to use db on routes.
	};
}
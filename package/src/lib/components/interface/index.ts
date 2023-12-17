import type { RequestEvent } from '@sveltejs/kit';
import type { Context, RESTInterfaceOptions, SingleOrMultipleRoutes } from '../types.js';
import { createClient } from './client.js';
import { createServerHandle } from './server.js';

export function createRESTInterface<T>(
	input: Record<string, SingleOrMultipleRoutes>,
	options?: RESTInterfaceOptions
) {
	options = options ? options : {};
	if (!options.routePrefiex) {
		options.routePrefiex = '/api';
	}
	return {
		client: createClient<T>(input, options.routePrefiex),
		serverHook: createServerHandle<T>(input, options.routePrefiex, options.createContext,options.cacheContext) // createContext makes user to use db on routes.
	};
}

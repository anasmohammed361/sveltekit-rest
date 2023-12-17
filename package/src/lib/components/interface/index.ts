import type { RequestEvent } from '@sveltejs/kit';
import type { Context, RESTInterfaceOptions, SingleOrMultipleRoutes } from '../types.js';
import { createSSRClient,createBrowserClient } from './client/index.js';
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
		client: createBrowserClient<T>(input, options.routePrefiex),
		server: createSSRClient<T,any>(input,options.createContext),
		serverHook: createServerHandle<any>(input, options.routePrefiex, options.createContext,options.cacheContext) // createContext makes user to use db on routes.
	};
}

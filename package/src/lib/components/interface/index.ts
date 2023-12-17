import type { Handle } from '@sveltejs/kit';
import type {  Client, RESTInterfaceOptions, SSRClient, SingleOrMultipleRoutes } from '../types.js';
import { createSSRClient,createBrowserClient } from './client/index.js';
import { createServerHandle } from './server.js';


/**
 * Creates a REST interface.
 * @template T - Represents the type of the Router.
 * @param {Record<string, SingleOrMultipleRoutes>} input - The input containing routes.
 * @param {RESTInterfaceOptions} [options] - Additional options for the REST interface.
 * @returns {{ client: Client<T>, server: SSRClient<T>, serverHook: Handle }} An object containing client, server, and serverHook.
 */
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

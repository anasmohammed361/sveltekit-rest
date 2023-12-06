import type { RequestEvent } from '@sveltejs/kit';
import type { ContextFn, Router, SingleOrMultipleRoutes } from '../types.js';
import { createClient } from './client.js';
import { createServerHandle } from './server.js';

/**
 * Creates a REST interface using the specified routes, allowing client and server interactions.
 * @param {Router} routes - The router object defining the REST endpoints.
 * @param {
 *   createContext?: Context<any>; // Optional function to create context
 *   routePrefiex?: `/${string}`; // Optional prefix for routes (defaults to '/api')
 * }} options - Additional options for creating the REST interface.
 * @returns {{
 *   client: any; // The client object for REST interactions.
 *   serverHook: any; // The server hook object for REST handling.
 * }}
 */
export function createRESTInterface<T>(
	routes: Router,
	opts: {
		createContext?: ContextFn<any>;
		/** Default to /api */
		routePrefix?: `/${string}`;
	} = {}
) {
	if (!opts.routePrefix) {
		opts.routePrefix = '/api';
	}
	return {
		client: createClient<T>(routes, opts.routePrefix),
		RestHandle: createServerHandle<any>(routes, opts.routePrefix, opts.createContext) // createContext makes user to use db on routes.
	};
}

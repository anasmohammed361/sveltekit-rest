import type { RequestEvent } from '@sveltejs/kit';
import type { Context, SingleOrMultipleRoutes } from '../types.js';
import { createClient } from './client.js';
import { createServerHandle } from './server.js';


/**
 * @param {Record<string, SingleOrMultipleRoutes>} input
 * @param {{
 * createContext?: Context<any>;
 * routePrefiex?: `/${string}`
 * }} 
 * @returns {{client: any;serverHook: any;}}
 */
export function createRESTInterface<T>(input: Record<string,SingleOrMultipleRoutes>,options:{ createContext?:Context<any> , 
	/** Default to /api */
	routePrefiex?: `/${string}`}={}) {
	if (!options.routePrefiex) {
		options.routePrefiex = "/api"
	}
	return {
		client: createClient<T>(input, options.routePrefiex),
		serverHook: createServerHandle<any>(input,options.routePrefiex,options.createContext) // createContext makes user to use db on routes.
	};
}
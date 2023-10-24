
import { api } from '$lib';
import type { RequestHandler } from './$types';

const hadler: RequestHandler = async (event) => {
	return api.createServer(event.params.route, event);
};

export { hadler as GET, hadler as POST };

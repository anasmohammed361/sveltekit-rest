// import type { RequestEvent } from '@sveltejs/kit';
// import { z } from 'zod';
// import { createRESTInterface, initSveltekitRest } from '../lib/index.js';
// let number = 0;
// export function chumma(event: RequestEvent) {
// 	console.log('Called', number++);
// 	return {
// 		db: {
// 			users: [
// 				{
// 					name: 'Kirthevasen',
// 					id: 1
// 				}
// 			]
// 		}
// 	};
// }

// const r = initSveltekitRest.withContext<ReturnType<typeof chumma>>().create();
// export const router = {
// 	user: r.input(z.object({ id: z.number() })).get(({ context, input }) => {
// 		console.log(input.id);
// 		return context.db.users.find((user) => user.id == input.id);
// 	})
// };
// export const { client, serverHook } = createRESTInterface<typeof router>(router, chumma);

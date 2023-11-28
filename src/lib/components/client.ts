import type { RequestEvent } from '@sveltejs/kit';
import type { ClientServer } from './types.js';

type NotNullParams<T> = T extends undefined ? [] : [T]

type Client<T> = {
	[K in keyof T]: T[K] extends { cb: (inp:{input:infer M , context: RequestEvent}) => infer U }
		? (...input:NotNullParams<M>)=>U
		: never;
};

export function generateClient<T>(
	input: ClientServer,
	routePrefiex: `/${string}`
) {
	const obj: any = {};
	let request: Promise<Response>;
	for (const [key, { cb, method, schema }] of Object.entries(input)) {
		obj[key] = async (inp: Parameters<typeof cb>['0']['input']) => {
			const parsedInput = schema?.parse(inp);
			if (method === 'GET') {
				const jsonified = JSON.stringify(parsedInput);
				const url = `${routePrefiex}/${key}${
					parsedInput !== undefined ? `?input=${encodeURIComponent(jsonified)}` : ''
				}`;
				request = fetch(url);
			} else {
				request = fetch(`${routePrefiex}/${key}`, {
					method,
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(parsedInput)
				});
			}

			const response = await request;

			if (response.ok) {
				const result = await response.json();
				return result?.output;
			} else {
				throw new Error(await response.text());
			}
		};
	}
	return obj as Client<T>;
}

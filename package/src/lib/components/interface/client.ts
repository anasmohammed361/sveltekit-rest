import type { Client, Route, SingleOrMultipleRoutes } from '../types.js';

export function createClient<T>(
	input: Record<string, SingleOrMultipleRoutes>,
	routePrefiex: `/${string}`
) {
	const obj: any = {};

	for (const [key, value] of Object.entries(input)) {
		if ('method' in value && 'cb' in value) {
			obj[key] = handleClient(
				value as Route<
					(typeof obj)[typeof key][0]['input'],
					ReturnType<(typeof obj)[typeof key]['0']>,
					(typeof obj)[typeof key][0]['input']['context']
				>,
				key,
				routePrefiex
			);
		} else {
			obj[key] = handleNestedClient<typeof value>(value, key, routePrefiex);
		}
	}
	return obj as Client<T>;
}

function handleNestedClient<T>(
	input: SingleOrMultipleRoutes,
	key: string,
	routePrefiex: `/${string}`
) {
	const obj: any = {};
	for (const [nestedKey, value] of Object.entries(input)) {
		if ('method' in value && 'cb' in value) {
			obj[nestedKey] = handleClient(
				value as Route<
					(typeof obj)[typeof key]['0']['input'],
					ReturnType<(typeof obj)[typeof key]['0']>,
					(typeof obj)[typeof key][0]['input']['context']
				>,
				`${key}.${nestedKey}`,
				routePrefiex
			);
		} else {
			obj[nestedKey] = handleNestedClient<(typeof obj)[typeof key]>(
				value,
				`${key}.${nestedKey}`,
				routePrefiex
			);
		}
	}

	return obj as Client<T>;
}

function handleClient(input: Route<any, any, any>, key: string, routePrefiex: `/${string}`) {
	const { cb, method, schema } = input;
	return async (inp: Parameters<typeof cb>['0'] extends {context:unknown,input:unknown} ? Parameters<typeof cb>['0']['input'] : undefined ) => {
		let request: Promise<Response>;
		console.log(inp);

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

import type { Client, ClientServer, PerRoute, RecordValue } from './types.js';

export function generateClient<T>(
	input: ClientServer,
	routePrefiex: `/${string}`
) {
	const obj: any = {};

	for (const [key, value] of Object.entries(input)) {
		if ('method' in value && 'cb' in value) {
			obj[key] = handleClient(value as PerRoute,key,routePrefiex)
		}else{
			obj[key] = handleNestedClient<typeof value>(value,key,routePrefiex)
		}
	}
	return obj as Client<T>;
}


function handleNestedClient<T>(input:RecordValue,key:string,routePrefiex:`/${string}`) {
	const obj:any ={}
	for(const [nestedKey,value] of Object.entries(input)){
		if ('method' in value) {
			obj[key] = handleClient(value as PerRoute,`${key}.${nestedKey}`,routePrefiex)
		}else{
			obj[key] = handleNestedClient(value,`${key}.${nestedKey}`,routePrefiex)
		}
	}
	return obj as Client<T>
}

function handleClient(input:PerRoute,key:string,routePrefiex:`/${string}`) {
	const { cb, method, schema } = input
	return async (inp: Parameters<typeof cb>['0']['input']) => {
		let request: Promise<Response>;
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
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

import {  type RequestEvent, json } from '@sveltejs/kit';
import type { TypeOf, z } from 'zod';

type route<I,T> = {
	input: z.ZodSchema<I>;
	method: HttpMethod;
	invoke: (input: I) => T;
};

export class API {
	private routes: Record<string, route<any, any>> = {};
	router<B, T>(routes: Record<string, route<B, T>>) {
		this.routes = { ...this.routes, ...routes };
		return this;
	}
	addRoute<B,T>(key: string, value: route<B,T>) {
		this.routes[key] = value;
	}
	async createServer(
		route: string,
		{ request, url }: RequestEvent
	) {
		if (route in Object.keys(this.routes)) {
			const currentRoute = this.routes[route];
			if (currentRoute.method === "GET") {
				console.log(url.searchParams);
			}
			console.log(await request.json());
			return json({ok:true})
		}
		throw new Error("No method found");
	}
	async client(prefix:string = "/api"){
		const routes = this.routes
		const clientObj:Record<keyof typeof routes,(input:any)=>any> = {}
		Object.entries(this.routes).map(([key,val])=>{
			const inputx = val.invoke
			clientObj[key]=async(input:Parameters<typeof inputx>):Promise<ReturnType<typeof inputx>>=>{
				if (val.method === "GET") {
					const params = this.objectToQueryParams(input[0])
					const url = `${prefix}/${key}?${params}`
					const res =await fetch(url)
					if (res.ok) {
						return res.json()
					}else{
						throw new Error(await res.text());
					}
				}else{
					const params = input[0]
					const url = `${prefix}/${key}`
					const res = await fetch(url,{
						method:val.method,
						headers:{
							'Content-Type':'application/json'
						},
						body:JSON.stringify(params)
					})
					if (res.ok) {
						return res.json()
					}else{
						throw new Error(await res.text());
					}
				}
			} 
		})
		return clientObj
	}

	private objectToQueryParams(obj:Record<string,string>) {
		const searchParams = new URLSearchParams();
	  
		for (const key in obj) {
		  if (obj.hasOwnProperty(key)) {
			searchParams.append(key, obj[key]);
		  }
		}
		return searchParams.toString();
	  }
}

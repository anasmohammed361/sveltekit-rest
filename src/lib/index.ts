import { z } from "zod";
import { API } from "./api/server";

export const api = new API();

api.addRoute('power', {
	input: z.object({ name: z.string() }),
	invoke(input) {
		const out = input.name + 'fuck';
		return { out };
	},
	method: 'GET'
});
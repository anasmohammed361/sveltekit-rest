import type { RequestEvent } from "@sveltejs/kit";
import type { Context } from "./types.js";

export function createContext<T>(inp:(event:RequestEvent)=>T):Context<T> {
    return inp
}

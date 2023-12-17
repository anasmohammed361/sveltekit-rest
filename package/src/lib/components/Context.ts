import type { RequestEvent } from "@sveltejs/kit";
import type { Context } from "./types.js";

/**
 * Creates a context based on the input function.
 * @template T - Represents the context type.
 * @param {(event: RequestEvent) => T} inp - The function that generates the context from a RequestEvent.
 * @returns {Context<T>} A context object of type T.
 */
export function createContext<T>(inp: (event: RequestEvent) => T): Context<T> {
    return inp;
}

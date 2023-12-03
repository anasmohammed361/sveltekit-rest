import { initSveltekitRest, createRESTInterface } from '../src/lib/index.js';
import { describe, expectTypeOf, it } from 'vitest';
import type { Handle } from '@sveltejs/kit';
import { z } from 'zod';

describe('Interface', () => {
	const t = initSveltekitRest.create();
	it('Hooks', () => {
		const routes = {
			regular: t.post(() => {
				return 200;
			}),
			promise: t
				.input(
					z.object({
						num: z.number()
					})
				)
				.post(async ({ input: { num } }) => {
					return new Promise<number>((res) => res(num));
				}),
			nested: {
				regular: t.get(() => {
					return `200`;
				}),
				promise: t
					.input(
						z.object({
							num: z.number()
						})
					)
					.post(async ({ input: { num } }) => {
						return new Promise<number>((res) => res(num));
					})
			}
		};
		const { client, serverHook } = createRESTInterface<typeof routes>(routes);
		expectTypeOf(serverHook).toEqualTypeOf<Handle>();
		expectTypeOf(client.regular).toEqualTypeOf<() => Promise<number>>();
		expectTypeOf(client.promise).toEqualTypeOf<(inp: { num: number }) => Promise<number>>();
		expectTypeOf(client.promise).toEqualTypeOf<(inp: { num: number }) => Promise<number>>();
		expectTypeOf(client.nested).toEqualTypeOf<{
			regular: () => Promise<string>;
			promise: (inp: { num: number }) => Promise<number>;
		}>();
	});
});

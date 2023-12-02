import { test, describe, expectTypeOf } from 'vitest';
import { initSveltekitRest } from '../src/lib/index.js';
import type { RequestEvent } from '@sveltejs/kit';

describe('Context', () => {
    test('defaultContext', () => {
        const t = initSveltekitRest.create();
		t.get(({ context }) => {
			expectTypeOf(context).toEqualTypeOf<{ event: RequestEvent }>();
            
		});
	});
    test('with Custom Context',()=>{
        const context = initSveltekitRest.withContext<{cookies:string}>()
        const t = context.create()
        t.get(({ context }) => {
			expectTypeOf(context).toEqualTypeOf<{ cookies:string }>();
		});
    })
});

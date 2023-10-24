import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { API } from '$lib/api/server';
import { z } from 'zod';

const api = new API()
z
api.addRoute("run",{
    query:z.object({
        name:z.string()
    }),
    method:"GET",
    invoke(input) {
        
    },
})
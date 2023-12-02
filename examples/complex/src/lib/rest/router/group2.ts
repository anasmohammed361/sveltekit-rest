import { initSveltekitRest } from "sveltekit-rest";
import { z } from "zod";

const r = initSveltekitRest.create()

export const groupTwoRouter = {
    one:r.input(z.object({name:z.string()})).get(({input})=>{
        return `Executed groupTwoRoute.one with input ${input.name}`
    }),
    two:r.input(z.number()).post(async({input})=>{
        return `Executed groupTwoRoute.two with input ${input}`
    })
}
import { initSveltekitRest } from "$lib/index.js";
import { describe,expect ,test} from "vitest";
const t = initSveltekitRest.create()
const mid = t.middleware(()=>{
    return {
        custom:'anas'
    }
})


describe('Middleware', () => {
   test('types',()=>{
    
   })
})

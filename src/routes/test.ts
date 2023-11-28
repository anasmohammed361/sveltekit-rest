import type { ClientServer } from "$lib/components/types.js";
import { SvelteKitREST } from "$lib/index.js";
import { z } from "zod";

const obj = new SvelteKitREST()
const routes:ClientServer={
    method:obj.input(z.object({
        name:z.string()
    })).get(({context,input})=>{
        console.log({context,input});
        return 22
    })
}
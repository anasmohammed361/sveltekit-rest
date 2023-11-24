import { SvelteKitREST, generateClient } from "$lib/index.js";
import { z } from "zod";

const rest = new SvelteKitREST()

const obj = {
    ok:rest.get(()=>{
        return 22
    }),
    okk:rest.input(z.object({
        name:z.string()
    })).get((input)=>{
        console.log(input);
        return 22
    })
}

const client = generateClient<typeof obj>(obj)

client.okk({name:'anas'})
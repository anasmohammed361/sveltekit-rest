import { createRESTInterface } from "sveltekit-rest";
import { router } from "./router";

export const { serverHook, client } =
  createRESTInterface<typeof router>(router,{
    routePrefiex:undefined
  });

import { initSveltekitRest } from "sveltekit-rest";
import { z } from "zod";

const r = initSveltekitRest.create();

export const router = {
  route1: r.get(() => {
    return Math.random();
  }),
  route2: r
    .input(
      z.object({
        name: z.string(),
      })
    )
    .post(
      ({
        input,
        context: { event }, // This is the Request Handler from Sveltekit . https://kit.svelte.dev/docs/types#public-types-requesthandler
      }) => {
        return `Hi ${input.name} , We got typesafe apis`;
      }
    ),
};


---
title: Basic Routing 
description: Setting up a router with Sveltekit-Rest.
---

## Router
The router object has all the routes and the corresponding configurations.

```ts {7,10}
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
```

The routes names will be same as the keys in the Router Object. Here we will have the route names as 
- route1
- route2

## Nested Routes
> For more information of Routing visit the [Routing docs](/config/routing/) 
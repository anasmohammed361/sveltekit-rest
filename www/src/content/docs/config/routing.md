---
title: Routing
description: We use Zod for runtime validation of data.
---

## Routing in Sveltekit-Rest

We support two routing mechanisms in Sveltekit-Rest

- [Basic Routing](#basic-routing)
- [Nested Routing](#nested-routing)

Both of these works similarly in Sveltekit-Rest , For any of more complex application , we suggest you going with the nested router as it gives much more flexibility on how you handle routes.

## Basic Routing

The is the simplest setup with just one Router Object.

```ts
# lib/rest/router.ts
export const router = {
  route1: ...,
  route2: ...
};
```

The keys `route1` and `route2` are used as the route values.
If a [Route Prefix](#api-route-prefix) is not altered.The Requests are sent to

- **/api/route1**
- **/api/route2**

## Nested Routing

In this approach we define individual routing objects and combine them into router Object.

##### Suggested Directory Structure

```txt
router
    ├── group1.ts
    ├── group2.ts
    ├── index.ts
    └── router.ts
```

##### Instatiate the Router

```ts
# router/router.ts
import { initSveltekitRest } from "sveltekit-rest";

export const r = initSveltekitRest.create()
```

##### Grouping of routes

```ts
# router/group1.ts
import { z } from "zod";
import { r } from "./router";

export const groupOneRouter = {
    one:r.input(z.object({name:z.string()})).get(({input})=>{
        return `Executed groupOneRoute.one with input ${input.name}`
    })
}
```

---

```ts
# router/group2.ts
export const groupTwoRouter = {
    one:r.input(z.object({name:z.string()})).get(({input})=>{
        return `Executed groupTwoRoute.one with input ${input.name}`
    }),
}
```
##### Combining the Router

```ts
# router/index.ts
import { groupOneRouter } from "./group1"
import { groupTwoRouter } from "./group2"

export const router = {
    groupOneRouter,
    groupTwoRouter
}
```
> You can also Nest routes at Multiple levels.
##### Accessing of APIs
```svelte  title="+page.svelte" {4-5}
<script lang="ts">
    import { client } from "$lib/rest";
    ...
    client.groupOneRouter.one({ name :"Kit" });
    client.groupTwoRouter.one({ name :"Rest" });
    ...
</script>
```
## Api Route Prefix
You can set a api prefix to your routes to avoid routing confict with you `sveltekit-endpoints`.

By default we use `/api` as the routing prefix so all your routes will be prefixed with `/api` when a request is made.

For an example , if your route is named `slug`. The request will be made to the route `/api/slug`

##### Altering the prefix
You can override the default prefix when you create the interface using createRESTInterface.
```ts {6}
# lib/rest/index.ts
import { createRESTInterface } from "sveltekit-rest";
...
export const { serverHook, client } =
  createRESTInterface<typeof router>(router,{
    routePrefiex:"/myCustomPrefix"
  });
```
Once you override you prefix , All your requests will be prefixed by this custom route.

For an example , if your route is named `slug`. The request will be made to the route `/myCustomPrefix/slug`.
> We also support Nested route prefix like **/my/custom/prefix**.
## How we handle Nested routes

In Sveltekit-Rest we don't create Nested routes for Nested Router, Instead we use one generic route for handling all requests.

Here is an example of such request

- `route: ...` will be requested as `/api/route`
- `nested:{ route : ... }` will be requested as `/api/nested.route`
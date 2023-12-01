---
title: Quick Start
description: Instructions to quickly get started with Sveltekit-Rest.
---

Follow these setps to quickly getting started with Sveltekit-Rest

## Installation
Install `sveltekit-rest` on you `sveltekit` project.
- npm
```bash title="Install with npm"
npm i sveltekit-rest
```
- pnpm
```bash title="Insall with pnpm"
pnpm add sveltekit-rest
```


## Setup
- ### Create Router
```ts
// src/lib/rest/router.ts
import { initSveltekitRest } from "sveltekit-rest";
import { z } from "zod";

const r = initSveltekitRest();

export const router = {

};
```

- Add routes to your Router

```ts {3-5}
// src/lib/rest/router.ts
export const router = {
  route1: r.get(() => {
    return Math.random();
  }),
};
```
- ### Create Interface


| Interface    | Description                                                |
|-------------------------|------------------------------------------------------------|
| **client**              | Typesafe client providing access to your APIs.               |
| **serverHook**          | Automatically generated hook by Sveltekit-Rest for server communication.  |

```ts
// src/lib/rest/index.ts
import { createRESTInterface } from "sveltekit-rest";
import { router } from "./router";

export const { serverHook, client } =
  createRESTInterface<typeof router>(router);

```

- ### Setup your hook

```ts
// src/hooks.server.ts

import { serverHook } from "$lib/rest";

export const handle = serverHook;

```

## Enjoy Your Typesafe Api

```svelte title="+page.svelte" {5}
<script lang="ts">
    import { client } from "$lib/rest";

    const handleApi = async () => {
        const value = await client.route1(); // value -> number
    };

</script>
```
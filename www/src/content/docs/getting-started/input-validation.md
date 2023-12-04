---
title: Input Validation
description: We use Zod for runtime validation of data.
---

We use [zod](https://zod.dev) for input validation , and inference of input parameters.

## Install Zod
- npm
```bash title="Install with npm"
npm i zod
```
- pnpm
```bash title="Insall with pnpm"
pnpm add zod
```

---

## Validation with Zod

You can add inputs to you REST endpoints by invoking the `input` method.

```ts {2 ,5-8} 
#lib/rest/router.ts
import { z } from "zod";
export const router = {
  route: 
    r.input(
        z.object({
        name:z.string()
    }))
    .get(({input}) => {
    // input -> { name:string } 
    return input.name ;
  }),
};
```

All of you data are validated with **zod** before passed into the function , So we also get **Runtime Validation** with Zod.

---

## How we handle Input in Sveltekit-Rest

All of you inputs are passed in the Request **Body** for HTTP the following HTTP Methods.

- POST
- PUT
- PATCH
- DELETE

We pass the inputs as **Query Params** for the following HTTP Method.

- GET

> Your Inputs are passed as **Encoded URI** on GET Method
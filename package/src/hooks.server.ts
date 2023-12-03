import type { Handle } from "@sveltejs/kit";
import { serverHook } from "./routes/chumma.js";

export const handle: Handle = serverHook;
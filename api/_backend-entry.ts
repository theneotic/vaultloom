import { createApp } from "../server/app";

/**
 * This entry is bundled to `api/_backend.cjs` during `build:vercel`.
 * Keeping the server graph behind a generated local module prevents a Vercel
 * Function from depending on untraced `server/*` source files at runtime.
 */
export default createApp();

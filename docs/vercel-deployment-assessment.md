# Vercel deployment assessment

## Verdict

**Vaultloom is not deployable on Vercel unchanged.** The client bundle can be built there, but the current repository expects a persistent Express process started by `server/_core/index.ts`. It also relies on Manus OAuth, a Manus Forge-backed storage proxy at `/manus-storage/*`, and database/runtime environment variables that are injected by the managed project environment rather than defined for Vercel.

The connected Vercel team has no existing project linked to `theneotic/vaultloom` as of the assessment. The repository's Dockerfile is used by its GitHub Actions container check; Vercel will not use that Dockerfile as an application runtime configuration.

## Required migration work

| Area | Current implementation | Vercel requirement |
| --- | --- | --- |
| Server entrypoint | `server/_core/index.ts` creates an Express app and calls `listen()`. | Split app creation from startup and expose the backend through a Vercel Node Function, such as an `api/*` entrypoint, or adopt a Vercel-supported full-stack framework adapter. Do not depend on the managed long-running server bootstrap. |
| Routing | Express owns `/api/trpc`, `/api/oauth/*`, and `/manus-storage/*`; Vite serves the SPA fallback. | Add `vercel.json` rewrites so `/api/*` reaches the serverless entrypoint and non-API paths serve the Vite SPA. Configure the Vercel build/output settings deliberately rather than relying on Vite auto-detection. |
| Database | Drizzle uses the managed project's `DATABASE_URL`. | Provide a Vercel-compatible external MySQL/TiDB connection string and ensure the selected database supports serverless connection patterns. Run the existing migration before production traffic. |
| Authentication | Manus OAuth uses managed `VITE_APP_ID`, `OAUTH_SERVER_URL`, and related portal values. | Replace this with a Vercel-compatible OAuth provider or provide an independently configured OAuth application and update callback URLs. |
| Asset delivery | `/manus-storage/*` is a proxy backed by Manus Forge credentials. | Move brand assets to Vercel public assets, Vercel Blob, or another S3-compatible bucket. Replace the Manus-specific proxy and add the new storage credentials in Vercel. |
| Build plugins | Vite currently includes `vite-plugin-manus-runtime`. | Remove or conditionally disable Manus-only build/runtime integration after testing a Vercel build. |

## Practical options

For the **password generator and analyzer only**, the quickest Vercel path is a static Vite deployment after removing the authenticated vulnerability-reporting workflow and Manus-specific storage proxy.

For the **complete product**, migrate the Express/tRPC backend into Vercel Functions, replace the Manus OAuth and storage dependencies, configure external database credentials, and then link the GitHub repository to a Vercel project. The current GitHub Actions quality gate can remain; it already verifies both the application build and its Dockerfile independently of Vercel.

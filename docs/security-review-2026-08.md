# Vaultloom risk-based application security review

**Review date:** August 27, 2026. This code review used the supplied AI-generated application checklist as a risk model, with emphasis on secret exposure, authentication and authorization, user-supplied evidence, browser protections, production boundaries, and vulnerable dependencies. It is a source and configuration review—not a penetration test or a substitute for testing the deployed Vercel Function with production credentials.

## Verified remediation status

| Area | Finding before this review | Completed code-level treatment | Status |
|---|---|---|---|
| Request-size denial of service | Express accepted JSON and URL-encoded bodies up to 50 MB although evidence is limited to 2 MB. | JSON is limited to 3 MB; URL-encoded bodies are limited to 32 KB with 50 parameters. | Remediated |
| Cross-site mutations | Cookie-authenticated tRPC mutations did not explicitly enforce a same-origin request. | Unsafe tRPC methods now require an exact `Origin` match to `APP_ORIGIN` or the request origin. | Remediated |
| Brute-force / abuse controls | No application-level throttle existed for report submissions or GitHub sign-in initiation. | Per-instance 10-minute limits now bound tRPC mutations and GitHub OAuth initiation; a distributed production limit remains a Vercel requirement. | Partially remediated |
| Cookie scope | Session cookies used `SameSite=None` even though Vaultloom uses same-origin requests. | Session cookies remain `HttpOnly`, host-scoped, and secure over HTTPS, but now use `SameSite=Lax`. | Remediated |
| Verbose failure disclosure | The React error boundary displayed raw exception stacks; database and OAuth errors were written with raw error objects. | Stack details are development-only; user-facing tRPC internal errors are generic; database and OAuth logs avoid raw error objects. | Remediated |
| Browser protections | The Vercel configuration did not apply security headers. | Global CSP, HSTS, clickjacking, MIME-sniffing, referrer, permissions, and cross-origin-opener protections are defined in `vercel.json`. | Requires deployment verification |
| Dependency vulnerabilities | Production audit reported high-severity advisories through Axios, Streamdown, Express/Drizzle, Nanoid, and Lodash. | Axios, Streamdown, Express, Drizzle ORM, and Nanoid were updated; a Lodash override was pinned to the audited patched line. | Remediated at high severity |

## Verified existing controls

Vulnerability-report submission is authenticated server-side with a protected tRPC procedure. The server derives the reporter identity from the session rather than a client-controlled user ID, writes only evidence metadata to SQL, generates a random private Blob key, and restricts accepted attachment metadata to TXT, JSON, PNG, and JPEG. The server also decodes and caps evidence at 2 MB before object storage. These controls reduce the risks of IDOR, unrestricted file upload, client-side-only security checks, and direct database record access.

The application uses Drizzle query builders for the reviewed database operations, rather than assembling SQL from requester-provided strings. The repository scan found no tracked `.env` files, private keys, or apparent hardcoded production credentials. The Vite production configuration does not enable source maps, and the dev log collector is development-only. None of these source checks can prove that a host, database, GitHub OAuth app, Blob store, deployment log, or historical Git commit has no secret; those must be checked in the configured services before release.

## Required production configuration

| Priority | Required control | Implementation owner / location |
|---|---|---|
| Critical | Set a unique `AUTH_SECRET` of at least 32 random bytes and never reuse it with another app. | Vercel Environment Variables |
| Critical | Set `APP_ORIGIN` to the exact HTTPS public origin, currently `https://vaultlooms.vercel.app`, and configure the GitHub OAuth callback as `https://vaultlooms.vercel.app/api/auth/github/callback`. | Vercel and GitHub OAuth App |
| Critical | Use an external MySQL/TiDB `DATABASE_URL` with only the application’s required schema permissions; prohibit public network access where the provider permits it. | Database provider and Vercel |
| Critical | Configure a private Vercel Blob store using `BLOB_READ_WRITE_TOKEN`; retain private evidence storage and do not expose Blob tokens to client code. | Vercel Storage and Environment Variables |
| High | Enable Vercel WAF or an edge/distributed rate limit for `/api/trpc/*` and `/api/auth/github/*`. The in-memory limiter is a baseline only and is not shared across serverless instances. | Vercel project security settings |
| High | Verify the deployed response headers, Vercel Function logs, Vercel preview protection, and that production source-map files are not publicly served. | Vercel deployment review |
| High | Establish database backups, Blob retention/recovery rules, OAuth credential rotation, and an alert path for failed OAuth, repeated 429 responses, and report-processing failures. | Infrastructure owner |
| Medium | Review GitHub repository history and Vercel deployment logs for the previously exposed personal access token; revoke it and rotate any credential ever committed or logged. | GitHub and Vercel administrators |

## Items not present in the reviewed product path

The current Vaultloom product does not expose a payment flow, webhook receiver, public administrator dashboard, AI agent/tool-action workflow, or tenant-facing object retrieval API. Those checklist categories should be re-reviewed before any such feature is introduced. The included template `AIChatBox` is not part of the public product routes; if an AI feature is later enabled, it must receive separate prompt-injection, data-access, authorization, and rate-limit review.

## Validation record

The updated code passed TypeScript checking and the complete Vitest suite. The dependency audit returned **no known high-severity production vulnerabilities** after the compatible upgrades and override. Standard Vite/Node and Vercel build commands must be rerun after every further dependency or security-policy change.

## Live Vercel validation status

The connected Vercel project showed that production was serving a **stale deployment** from commit `ac70323` during this review. A safe unauthenticated request to `https://vaultlooms.vercel.app/api/trpc/system.health?batch=1&input=%7B%7D` returned `500 FUNCTION_INVOCATION_FAILED`. The deployment dashboard showed the same stale production source, and its runtime log view did not provide request events for the probe. A direct live home-page header check returned HSTS but none of the newly configured CSP, frame, MIME-sniffing, referrer, permissions, or opener headers. Consequently, the latest security hardening and theme corrections are **not yet deployed** and the current catch-all Vercel Function remains unverified in production.

The next release must push the current user-attributed commit, trigger a deployment from it, then retest the tRPC health route, production response headers, and the authenticated reporting flow. If the catch-all still fails, its `server/*` imports must be bundled or replaced with a self-contained Vercel-safe entrypoint before OAuth or reporting can be enabled.

The authenticated Vercel Environment Variables page showed **no project variables**. This confirms that `AUTH_SECRET`, `APP_ORIGIN`, `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `DATABASE_URL`, and `BLOB_READ_WRITE_TOKEN` are absent in the current project. Adding those values must be performed through Vercel’s secure environment-variable interface; credentials must not be placed in source control, client code, or this review document.

## References

[1]: https://vercel.com/docs/project-configuration/vercel-json "Vercel: Static Configuration with vercel.json"
[2]: https://vercel.com/docs/cdn-security/security-headers "Vercel: Content Security Policy"
[3]: https://vercel.com/docs/vercel-blob/private-storage "Vercel: Private Blob storage"

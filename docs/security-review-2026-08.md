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

At the start of this review, the connected Vercel project served a **stale deployment** from commit `ac70323`. A safe unauthenticated health request returned `500 FUNCTION_INVOCATION_FAILED`, and a direct home-page header check returned HSTS but none of the new CSP, frame, MIME-sniffing, referrer, permissions, or opener headers. The deployment was subsequently updated as described below.

The user-attributed security release was pushed, the catch-all was prebundled as an ESM artifact, and the live `system.health` route and browser headers were retested successfully. Authenticated reporting remains intentionally unavailable until its provider configuration is supplied.

The authenticated Vercel Environment Variables page showed **no project variables**. This confirms that `AUTH_SECRET`, `APP_ORIGIN`, `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `DATABASE_URL`, and `BLOB_READ_WRITE_TOKEN` are absent in the current project. Adding those values must be performed through Vercel’s secure environment-variable interface; credentials must not be placed in source control, client code, or this review document.

The first post-review deployment (`e79f67f`) bundled the backend as CommonJS but still returned `FUNCTION_INVOCATION_FAILED` for the health probe. Local bundle inspection confirmed that Vaultloom depends on the ESM-only `jose` package, so the bundle was revised to ESM in commit `2ae4b33`; the generated artifact imports locally as an Express handler. The revised Vercel deployment returned `200 application/json` for the valid anonymous `system.health` request and supplied the configured CSP, HSTS, frame, MIME-sniffing, referrer, permissions, and cross-origin-opener headers. The catch-all startup failure is therefore resolved; OAuth, database, Blob, and authenticated-report validation remain dependent on configuration that is not yet present.

The connected browser visually confirmed that the live dark homepage preserves its layout and that the three-step Analyze–Interpret–Generate panel now has a dark surface with readable headings, descriptions, and dividers. The browser extension timed out while switching to light mode, so the live light-state review remains pending; the matching local light-state review and theme regression tests have already passed.

## Deferred reporting mode

Vaultloom now derives reporting availability on the server. The public capability check and the protected submit route require a valid `AUTH_SECRET`, `APP_ORIGIN`, GitHub OAuth client credentials, an external database URL, and a private Blob token; the result reveals only a boolean capability, never missing-variable names or values. Until all requirements exist, Contact shows a non-interactive notice rather than a sign-in action, and direct submission is refused. The live capability response was `available: false`, and the deployed Contact page displayed the non-interactive notice. This keeps the public local-only workbench operational while avoiding a partially configured reporting service.

## References

[1]: https://vercel.com/docs/project-configuration/vercel-json "Vercel: Static Configuration with vercel.json"
[2]: https://vercel.com/docs/cdn-security/security-headers "Vercel: Content Security Policy"
[3]: https://vercel.com/docs/vercel-blob/private-storage "Vercel: Private Blob storage"

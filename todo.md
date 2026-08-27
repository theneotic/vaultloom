# Vaultloom public-site extension

- [x] Add persistent public navigation with Workbench, About, Contact, Privacy, and Terms links.
- [x] Create dedicated About, Contact, Privacy, and Terms pages with accurate local-only disclosures.
- [x] Add a support-focused footer with owner identity, contact route, copyright, and legal links.
- [x] Verify internal navigation, desktop/mobile layouts, unit tests, and production build.

# Vaultloom accessibility and reporting extension

- [x] Add a persistent, accessible dark-mode control with stored user preference and system-theme fallback.
- [x] Make the live local generator and guessability analyzer immediately discoverable from the homepage.
- [x] Upgrade the project for authenticated server-side vulnerability-report storage and optional attachments.
- [x] Build a validated vulnerability-report form that avoids sensitive-secret collection and restricts attachments.
- [x] Verify theme switching, live workbench behavior, report submission, tests, and production build.

# Standalone product rebrand

- [x] Replace SlaySecure Pro with a distinct product name across the application, metadata, documentation, and GitHub repository.
- [x] Verify the rebranded public routes, automated tests, and production build.

# Vaultloom brand selection

- [x] Replace temporary HushMetric branding with Vaultloom across the interface, metadata, documentation, and private GitHub repository.
- [x] Verify the Vaultloom public routes, automated tests, production build, and renamed remote.

# Asset delivery repair

- [x] Diagnose and restore broken Vaultloom visual asset loading across public routes.
- [x] Verify asset requests and visual rendering after the repair.

# Complete theme coverage

- [x] Apply the dark-mode palette to every Vaultloom workbench surface, control, form, and footer.
- [x] Verify complete light and dark theme coverage across public routes and responsive layouts.

# Phone-friendly interface

- [x] Make Vaultloom navigation, live workbench controls, reporting form, and footer comfortable to use on phone-sized screens.
- [x] Verify responsive behavior at desktop and phone breakpoints across all public routes.

# Final theme and mobile verification

- [x] Verify explicit light and dark theme states across every public route.
- [x] Review the remaining About and Terms routes at phone width, then rerun final automated validation.
- [x] Record the explicit light and dark visual review across every public route.
- [x] Run type checking, automated tests, and a production build against the final responsive state.

# GitHub repository migration

- [x] Archive the existing Vaultloom GitHub repository under a distinct private name.
- [x] Create a fresh private vaultloom repository and publish the completed project using the user’s configured GitHub identity.
- [x] Verify repository ownership, commit attribution, remote configuration, and default branch.

# Image delivery regression

- [x] Diagnose why Vaultloom images are not loading in the current site preview.
- [x] Repair image delivery and verify all branded assets resolve from every public route.
- [x] Document the verified asset-delivery behavior and the cache-busting remediation for future artwork updates.

# GitHub synchronization follow-up

- [x] Investigate the reported failed status for the image-delivery commit in the Vaultloom repository.
- [x] Correct and verify the user-attributed private-repository commit state.

# GitHub Actions quality-gate repair

- [x] Inspect the failed test-and-build workflow logs and identify the CI-specific root cause.
- [x] Repair the workflow or project configuration and verify a green quality-gate run on GitHub.

# Explicit user-attributed release commit

- [x] Commit and push the latest Vaultloom work with both author and committer set to THE <sigmamale2951@gmail.com>.
- [x] Verify GitHub associates the pushed commit with the theneotic account.

# Vercel deployment assessment

- [x] Assess Vaultloom’s current Vercel deployment compatibility and document any required runtime, environment, or routing changes.
- [x] Document the Vercel compatibility verdict, required serverless routing changes, and Manus-specific runtime constraints.

# Vercel Functions migration

- [x] Extract the Express/tRPC application into a Vercel-compatible server entrypoint while preserving local development.
- [ ] Replace Manus OAuth with Vercel-compatible authentication behavior for protected vulnerability reporting (adapter implemented; live OAuth remains unconfigured and unverified).
- [ ] Replace the Manus storage proxy with Vercel-compatible public image delivery and server-side evidence storage (adapter implemented; Blob remains unconfigured and unseeded).
- [ ] Add Vercel build, API routing, SPA fallback, and required environment-variable configuration (build/routing implemented; live environment remains unconfigured).
- [ ] Create the Vercel project first, then finalize GitHub OAuth callback URLs using the actual Vercel deployment domain.
- [ ] Validate backend routes, protected reporting boundaries, image responses, local build, and Vercel deployment behavior.
- [ ] Commit and push the completed Vercel migration under THE <sigmamale2951@gmail.com>, then verify GitHub attribution and CI.
- [ ] Create the linked Vercel project and verify a live deployment without exposing secrets.
- [ ] Obtain the GitHub OAuth credentials, Vercel Blob token/base URL, and external database URL required to configure the live Vercel deployment.
- [ ] Seed the public Vercel Blob objects for the Vaultloom mark, texture, and generator artwork, then verify all images load from the deployed site.

# Deferred production reporting

- [x] Gate reporting availability on verified server/runtime configuration, not only a frontend flag.
- [x] Verify the live Contact page remains non-interactive until all OAuth, database, and Blob configuration is present.
- [x] Replace the unavailable production reporting sign-in action with a clear, non-interactive deferred-reporting notice.

# Catch-all Function startup repair

- [x] Prebundle the Express/tRPC catch-all backend into a Vercel-safe API artifact so server imports cannot be omitted at runtime.
- [x] Verify and correct the bundled backend module format so ESM-only server dependencies can load in the Vercel Function.
- [x] Deploy and verify that the anonymous tRPC health route no longer returns `FUNCTION_INVOCATION_FAILED`.

# Public-layout refinement

- [x] Audit all public routes for structural hierarchy, navigation clarity, spacing, and responsive breakpoints.
- [x] Refine the public workbench and content-page layouts for coherent desktop and phone presentation.
- [x] Verify every public route at desktop and phone widths after the structural update.
- [x] Retake desktop public-route screenshots after the final shared-header navigation update and record the verification.

# Deployed-image reliability

- [x] Inspect the actual deployed Vercel brand-image responses and record the failing status or error once the live URL is available.
- [x] Add a deployment-safe brand-image fallback that does not require unseeded Blob configuration.
- [x] Verify all visible images resolve on the deployed site before closing the reliability issue.
- [ ] Inspect https://vaultlooms.vercel.app/ directly at desktop and phone widths after the deployment-safe fallback commit.
- [ ] Review every live public route at desktop width after the final SVG endpoint repair.
- [ ] Review every live public route at phone width after the final SVG endpoint repair.

# Full workbench theme repair

- [x] Audit fixed dark workbench colors that prevent the light theme from changing the main analysis and generator surfaces.
- [x] Refactor the workbench, navigation, and supporting panels to use coherent light and dark theme treatments.
- [x] Preserve the existing layout, typography, spacing, and interactions while changing only theme color treatments.
- [x] Recolor every authenticated reporting-form control and status panel without altering structure.
- [ ] Capture and review both light and dark theme states for every public route at desktop and phone widths.
- [x] Commit and push the theme repair under THE <sigmamale2951@gmail.com>, then verify GitHub attribution and CI.

# Dark sequence-panel contrast repair

- [x] Correct the dark-mode sequence-panel text and border contrast without changing its layout or content.
- [ ] Verify the corrected sequence panel at desktop and phone widths, then checkpoint the repair.

# Risk-based application security review

- [x] Audit Vaultloom against the supplied AI-generated application security checklist, prioritizing secrets, authentication, authorization, uploads, and production exposure.
- [x] Implement evidence-backed code-level remediations and regression tests for verified findings.
- [x] Document configuration-dependent Vercel, OAuth, database, Blob, monitoring, and backup safeguards separately from code findings.
- [x] Validate the remediations, checkpoint the audit, and record the user-attributed release status.
- [x] Reduce API request-size exposure and add bounded in-memory abuse protection for sensitive mutation and sign-in paths.
- [x] Add Vercel-wide browser security headers and prevent client/server error details from being exposed to users.
- [x] Update or remove production dependencies with verified high-severity advisories, then re-run the production audit.

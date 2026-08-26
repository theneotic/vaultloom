# Vaultloom asset delivery

Vaultloom references product artwork only through the central `client/src/lib/assets.ts` manifest. Each value is a project-scoped immutable `/manus-storage/` key rather than a direct CDN link.

At request time, `server/_core/storageProxy.ts` requests a fresh presigned URL from the platform storage service and returns a `307` redirect with `Cache-Control: no-store`. A client should therefore follow the redirect; a bare proxy request is expected to return `307`, not image bytes.

## Regression remediation

The reported delivery failure was not reproducible as a persistent storage-proxy error: the original asset keys still produced valid presigned redirects when inspected. To eliminate the risk of a client retaining superseded immutable-object references, the three active assets were re-uploaded and the manifest was updated together with newly versioned keys. The refreshed mark, texture, and generator artwork were each checked directly, and the workbench plus every public route were visually reviewed.

For future artwork updates, upload source files from `/home/ubuntu/webdev-static-assets/` with the project asset workflow, update every affected manifest entry in one change, and never commit direct signed CDN URLs. The storage proxy must remain registered ahead of the application router and static/Vite handling in `server/_core/index.ts`.

## Vercel live check — August 2026

The live `https://vaultlooms.vercel.app/` homepage is serving the CSS-rendered Vaultloom glyph, header texture, and generator field successfully; these visible treatments no longer require a remote image request. The legacy `/api/brand/mark` path currently returns Vercel `404 NOT_FOUND`, which confirms the deployment is not registering the catch-all backend Function. This does not break the visible brand system after the fallback repair, but the API route must be fixed before authenticated reporting or Blob-backed uploads can operate on Vercel.

After commit `0d3114c` added an explicit `/api/:path*` rewrite to `/api/[...path]`, the public endpoint still returned `404 NOT_FOUND` during the immediate live check. The deployed homepage continues to render because it no longer calls that endpoint. This indicates the Vercel project needs inspection for its deployment source/root-directory or function-discovery settings, rather than another client-image change.

Vercel runtime logs later identified the exact crash: the initial isolated image route imported `server/brandAssets`, but the deployed Function could not resolve `/var/task/server/brandAssets`. The brand Function is therefore kept self-contained, with no project-server import, so it can return an SVG image even before database, OAuth, and Blob configuration are complete.

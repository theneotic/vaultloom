# Vaultloom asset delivery

Vaultloom references product artwork only through the central `client/src/lib/assets.ts` manifest. Each value is a project-scoped immutable `/manus-storage/` key rather than a direct CDN link.

At request time, `server/_core/storageProxy.ts` requests a fresh presigned URL from the platform storage service and returns a `307` redirect with `Cache-Control: no-store`. A client should therefore follow the redirect; a bare proxy request is expected to return `307`, not image bytes.

## Regression remediation

The reported delivery failure was not reproducible as a persistent storage-proxy error: the original asset keys still produced valid presigned redirects when inspected. To eliminate the risk of a client retaining superseded immutable-object references, the three active assets were re-uploaded and the manifest was updated together with newly versioned keys. The refreshed mark, texture, and generator artwork were each checked directly, and the workbench plus every public route were visually reviewed.

For future artwork updates, upload source files from `/home/ubuntu/webdev-static-assets/` with the project asset workflow, update every affected manifest entry in one change, and never commit direct signed CDN URLs. The storage proxy must remain registered ahead of the application router and static/Vite handling in `server/_core/index.ts`.

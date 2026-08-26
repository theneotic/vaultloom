import type { IncomingMessage, ServerResponse } from "node:http";
import { getBrandAssetFallbackSvg, getBrandAssetUrl, isBrandAsset } from "../../server/brandAssets";

function assetFromRequest(request: IncomingMessage) {
  const pathname = new URL(request.url ?? "/", "https://vaultloom.local").pathname;
  return pathname.split("/").filter(Boolean).at(-1) ?? "";
}

/** Lightweight image endpoint that remains healthy even if the application backend is not configured. */
export default function handler(request: IncomingMessage, response: ServerResponse) {
  const asset = assetFromRequest(request);
  if (!isBrandAsset(asset)) {
    response.statusCode = 404;
    response.setHeader("Content-Type", "application/json; charset=utf-8");
    response.end(JSON.stringify({ error: "Unknown brand asset." }));
    return;
  }

  const blobUrl = getBrandAssetUrl(asset);
  if (blobUrl && !blobUrl.startsWith("/")) {
    response.statusCode = 307;
    response.setHeader("Cache-Control", "public, max-age=3600, s-maxage=86400");
    response.setHeader("Location", blobUrl);
    response.end();
    return;
  }

  response.statusCode = 200;
  response.setHeader("Content-Type", "image/svg+xml; charset=utf-8");
  response.setHeader("Cache-Control", "public, max-age=3600, s-maxage=86400");
  response.end(getBrandAssetFallbackSvg(asset));
}

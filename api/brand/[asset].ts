import type { IncomingMessage, ServerResponse } from "node:http";

const assets = ["mark", "texture", "generatorArt"] as const;
type BrandAsset = (typeof assets)[number];

function isBrandAsset(value: string): value is BrandAsset {
  return assets.includes(value as BrandAsset);
}

function svgFor(asset: BrandAsset) {
  const shared = `xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" role="img" aria-label="Vaultloom ${asset}"`;
  if (asset === "mark") {
    return `<svg ${shared} viewBox="0 0 96 96"><rect width="96" height="96" fill="#101217"/><rect x="10" y="10" width="76" height="76" fill="none" stroke="#275df5" stroke-width="5"/><rect x="25" y="30" width="10" height="38" fill="#94b2ff"/><rect x="43" y="40" width="10" height="28" fill="#78a0ff"/><rect x="61" y="49" width="10" height="19" fill="#5783ff"/></svg>`;
  }
  if (asset === "texture") {
    return `<svg ${shared}><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#111827"/><stop offset=".5" stop-color="#18264c"/><stop offset="1" stop-color="#101217"/></linearGradient><pattern id="grid" width="22" height="22" patternUnits="userSpaceOnUse"><path d="M22 0H0V22" fill="none" stroke="#dbe7ff" stroke-opacity=".08"/></pattern></defs><rect width="640" height="360" fill="url(#g)"/><path d="M120 0L470 0 160 360H0Z" fill="#275df5" fill-opacity=".14"/><rect width="640" height="360" fill="url(#grid)"/></svg>`;
  }
  return `<svg ${shared}><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#0d1016"/><stop offset=".55" stop-color="#14254f"/><stop offset="1" stop-color="#0d1016"/></linearGradient><pattern id="grid" width="18" height="18" patternUnits="userSpaceOnUse"><path d="M18 0H0V18" fill="none" stroke="#dbe7ff" stroke-opacity=".09"/></pattern></defs><rect width="640" height="360" fill="url(#g)"/><path d="M410 0H640V360H90Z" fill="#275df5" fill-opacity=".24"/><rect width="640" height="360" fill="url(#grid)"/></svg>`;
}

function assetFromRequest(request: IncomingMessage) {
  const pathname = new URL(request.url ?? "/", "https://vaultloom.local").pathname;
  return pathname.split("/").filter(Boolean).at(-1) ?? "";
}

/** Self-contained Function: it does not depend on Vercel bundling project server modules. */
export default function handler(request: IncomingMessage, response: ServerResponse) {
  const asset = assetFromRequest(request);
  if (!isBrandAsset(asset)) {
    response.statusCode = 404;
    response.setHeader("Content-Type", "application/json; charset=utf-8");
    response.end(JSON.stringify({ error: "Unknown brand asset." }));
    return;
  }

  response.statusCode = 200;
  response.setHeader("Content-Type", "image/svg+xml; charset=utf-8");
  response.setHeader("Cache-Control", "public, max-age=3600, s-maxage=86400");
  response.end(svgFor(asset));
}

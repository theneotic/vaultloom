const BRAND_OBJECTS = {
  mark: "vaultloom/brand/mark.png",
  texture: "vaultloom/brand/texture.png",
  generatorArt: "vaultloom/brand/generator-art.png",
} as const;

type BrandAsset = keyof typeof BRAND_OBJECTS;

const localManagedFallbacks: Record<BrandAsset, string> = {
  mark: "/manus-storage/slaysecure-pro-mark_8300fb41.png",
  texture: "/manus-storage/slaysecure-pro-texture_2ec82676.png",
  generatorArt: "/manus-storage/slaysecure-pro-generator-art_cfe55042.png",
};

export const brandAssetKeys = Object.keys(BRAND_OBJECTS) as BrandAsset[];

export function getBrandAssetUrl(asset: BrandAsset) {
  const baseUrl = process.env.BLOB_PUBLIC_BASE_URL?.replace(/\/+$/, "");
  if (baseUrl) return `${baseUrl}/${BRAND_OBJECTS[asset]}`;
  return process.env.NODE_ENV === "production" ? null : localManagedFallbacks[asset];
}

export function isBrandAsset(value: string): value is BrandAsset {
  return brandAssetKeys.includes(value as BrandAsset);
}

/**
 * Durable vector fallbacks for direct `/api/brand/*` requests. They keep the
 * brand endpoints image-safe before a production Blob store has been seeded.
 */
export function getBrandAssetFallbackSvg(asset: BrandAsset) {
  const shared = `xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" role="img" aria-label="Vaultloom ${asset}"`;
  if (asset === "mark") {
    return `<svg ${shared} viewBox="0 0 96 96"><rect width="96" height="96" fill="#101217"/><rect x="10" y="10" width="76" height="76" fill="none" stroke="#275df5" stroke-width="5"/><rect x="25" y="30" width="10" height="38" fill="#94b2ff"/><rect x="43" y="40" width="10" height="28" fill="#78a0ff"/><rect x="61" y="49" width="10" height="19" fill="#5783ff"/></svg>`;
  }
  if (asset === "texture") {
    return `<svg ${shared}><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#111827"/><stop offset=".5" stop-color="#18264c"/><stop offset="1" stop-color="#101217"/></linearGradient><pattern id="grid" width="22" height="22" patternUnits="userSpaceOnUse"><path d="M22 0H0V22" fill="none" stroke="#dbe7ff" stroke-opacity=".08"/></pattern></defs><rect width="640" height="360" fill="url(#g)"/><path d="M120 0L470 0 160 360H0Z" fill="#275df5" fill-opacity=".14"/><rect width="640" height="360" fill="url(#grid)"/></svg>`;
  }
  return `<svg ${shared}><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#0d1016"/><stop offset=".55" stop-color="#14254f"/><stop offset="1" stop-color="#0d1016"/></linearGradient><pattern id="grid" width="18" height="18" patternUnits="userSpaceOnUse"><path d="M18 0H0V18" fill="none" stroke="#dbe7ff" stroke-opacity=".09"/></pattern></defs><rect width="640" height="360" fill="url(#g)"/><path d="M410 0H640V360H90Z" fill="#275df5" fill-opacity=".24"/><rect width="640" height="360" fill="url(#grid)"/></svg>`;
}

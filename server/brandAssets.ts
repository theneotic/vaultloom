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
  return process.env.NODE_ENV === "production"
    ? null
    : localManagedFallbacks[asset];
}

export function isBrandAsset(value: string): value is BrandAsset {
  return brandAssetKeys.includes(value as BrandAsset);
}

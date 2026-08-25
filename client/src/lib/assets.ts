/**
 * Stable, immutable web-storage paths for Vaultloom's brand and editorial imagery.
 * These paths must remain relative `/manus-storage/` keys: the server storage proxy
 * exchanges each key for a fresh signed URL and intentionally disables proxy caching.
 * When artwork is re-uploaded, update all three keys together to prevent clients
 * from retaining references to the superseded immutable objects.
 */
export const vaultloomAssets = {
  mark: "/manus-storage/slaysecure-pro-mark_8300fb41.png",
  texture: "/manus-storage/slaysecure-pro-texture_2ec82676.png",
  generatorArt: "/manus-storage/slaysecure-pro-generator-art_cfe55042.png",
} as const;

export const vaultloomAssetPaths = Object.values(vaultloomAssets);

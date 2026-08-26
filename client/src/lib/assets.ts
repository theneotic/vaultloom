/**
 * Brand imagery is served through same-origin API routes. Production routes
 * redirect to public Vercel Blob objects; local preview retains its storage fallback.
 */
export const vaultloomAssets = {
  mark: "/api/brand/mark",
  texture: "/api/brand/texture",
  generatorArt: "/api/brand/generatorArt",
} as const;

export const vaultloomAssetPaths = Object.values(vaultloomAssets);

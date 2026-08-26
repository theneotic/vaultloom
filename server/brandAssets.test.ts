import { afterEach, describe, expect, it } from "vitest";
import { getBrandAssetUrl, isBrandAsset } from "./brandAssets";

const originalEnvironment = { NODE_ENV: process.env.NODE_ENV, BLOB_PUBLIC_BASE_URL: process.env.BLOB_PUBLIC_BASE_URL };

afterEach(() => {
  process.env.NODE_ENV = originalEnvironment.NODE_ENV;
  if (originalEnvironment.BLOB_PUBLIC_BASE_URL === undefined) delete process.env.BLOB_PUBLIC_BASE_URL;
  else process.env.BLOB_PUBLIC_BASE_URL = originalEnvironment.BLOB_PUBLIC_BASE_URL;
});

describe("Vercel brand asset delivery", () => {
  it("maps public Blob storage to stable version-independent object paths", () => {
    process.env.BLOB_PUBLIC_BASE_URL = "https://vaultloom.public.blob.vercel-storage.com/";
    expect(getBrandAssetUrl("mark")).toBe("https://vaultloom.public.blob.vercel-storage.com/vaultloom/brand/mark.png");
    expect(getBrandAssetUrl("texture")).toBe("https://vaultloom.public.blob.vercel-storage.com/vaultloom/brand/texture.png");
  });

  it("keeps a managed-storage fallback only outside production", () => {
    delete process.env.BLOB_PUBLIC_BASE_URL;
    process.env.NODE_ENV = "development";
    expect(getBrandAssetUrl("generatorArt")).toMatch(/^\/manus-storage\/.+\.png$/);
    process.env.NODE_ENV = "production";
    expect(getBrandAssetUrl("generatorArt")).toBeNull();
  });

  it("rejects unknown route names before storage resolution", () => {
    expect(isBrandAsset("mark")).toBe(true);
    expect(isBrandAsset("../private-evidence")).toBe(false);
  });
});

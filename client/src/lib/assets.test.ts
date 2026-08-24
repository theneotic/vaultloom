import { describe, expect, it } from "vitest";
import { vaultloomAssetPaths } from "./assets";

describe("Vaultloom asset manifest", () => {
  it("uses the stable project storage paths for every visible brand asset", () => {
    expect(vaultloomAssetPaths).toHaveLength(3);
    expect(new Set(vaultloomAssetPaths).size).toBe(vaultloomAssetPaths.length);
    vaultloomAssetPaths.forEach(path => expect(path).toMatch(/^\/manus-storage\/.+\.(png|webp|jpg)$/));
  });
});

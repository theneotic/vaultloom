import { describe, expect, it } from "vitest";
import { vaultloomAssetPaths } from "./assets";

describe("Vaultloom asset manifest", () => {
  it("uses same-origin brand routes for every visible asset", () => {
    expect(vaultloomAssetPaths).toHaveLength(3);
    expect(new Set(vaultloomAssetPaths).size).toBe(vaultloomAssetPaths.length);
    vaultloomAssetPaths.forEach(path => expect(path).toMatch(/^\/api\/brand\/[a-zA-Z]+$/));
  });
});

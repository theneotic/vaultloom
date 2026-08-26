import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("Vaultloom visible brand delivery", () => {
  it("does not make the rendered workbench depend on external image URLs", () => {
    const home = readFileSync(
      resolve(import.meta.dirname, "../pages/Home.tsx"),
      "utf8"
    );
    const publicPage = readFileSync(
      resolve(import.meta.dirname, "../components/PublicPage.tsx"),
      "utf8"
    );
    expect(home).not.toContain("vaultloomAssets");
    expect(publicPage).not.toContain("vaultloomAssets");
  });
});

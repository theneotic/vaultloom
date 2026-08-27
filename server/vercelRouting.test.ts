import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("Vercel routing", () => {
  it("routes every deployed API path to the catch-all Function before SPA rewrites", () => {
    const config = JSON.parse(readFileSync(resolve(import.meta.dirname, "../vercel.json"), "utf8")) as {
      rewrites: Array<{ source: string; destination: string }>;
    };
    expect(config.rewrites).toContainEqual({ source: "/api/:path*", destination: "/api/[...path]" });
    expect(config.functions).toHaveProperty("api/**/*.ts");
    expect(config.rewrites).toContainEqual({ source: "/api/brand/:asset", destination: "/api/brand/[asset]" });
  });

  it("loads the catch-all Function from a build-time bundled backend artifact", () => {
    const route = readFileSync(resolve(import.meta.dirname, "../api/[...path].ts"), "utf8");
    const entry = readFileSync(resolve(import.meta.dirname, "../api/_backend-entry.ts"), "utf8");
    const packageJson = readFileSync(resolve(import.meta.dirname, "../package.json"), "utf8");

    expect(route).toContain('from "./_backend.mjs"');
    expect(route).not.toContain("../server/app");
    expect(entry).toContain('from "../server/app"');
    expect(packageJson).toContain("api/_backend-entry.ts");
    expect(packageJson).toContain("--bundle --format=esm --outfile=api/_backend.mjs");
    expect(packageJson).toContain("verify:vercel-backend");
  });

  it("keeps the deployed brand function self-contained", () => {
    const route = readFileSync(resolve(import.meta.dirname, "../api/brand/[asset].ts"), "utf8");
    expect(route).not.toContain("../../server/");
    expect(route).toContain("image/svg+xml");
  });
});

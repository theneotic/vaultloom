import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("Vercel routing", () => {
  it("routes every deployed API path to the catch-all Function before SPA rewrites", () => {
    const config = JSON.parse(readFileSync(resolve(import.meta.dirname, "../vercel.json"), "utf8")) as {
      rewrites: Array<{ source: string; destination: string }>;
    };
    expect(config.rewrites[0]).toEqual({ source: "/api/:path*", destination: "/api/[...path]" });
    expect(config.functions).toHaveProperty("api/**/*.ts");
  });
});

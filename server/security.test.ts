import { describe, expect, it } from "vitest";
import { createMutationRateLimiter, requireSameOriginMutation } from "./security";

function responseRecorder() {
  const result = { statusCode: 200, body: undefined as unknown, retryAfter: undefined as string | undefined };
  const response = {
    setHeader: (key: string, value: string) => {
      if (key === "Retry-After") result.retryAfter = value;
    },
    status: (statusCode: number) => {
      result.statusCode = statusCode;
      return response;
    },
    json: (body: unknown) => {
      result.body = body;
      return response;
    },
  };
  return { result, response };
}

describe("request hardening", () => {
  it("limits unsafe requests but never blocks read-only requests", () => {
    let now = 1_000;
    const limit = createMutationRateLimiter({ limit: 2, windowMs: 5_000, now: () => now });
    const req = { method: "POST", headers: { "x-forwarded-for": "198.51.100.7" } };
    const run = (method = "POST") => {
      const { result, response } = responseRecorder();
      let nextCalled = false;
      limit({ ...req, method } as never, response as never, () => { nextCalled = true; });
      return { result, nextCalled };
    };

    expect(run()).toMatchObject({ nextCalled: true, result: { statusCode: 200 } });
    expect(run()).toMatchObject({ nextCalled: true, result: { statusCode: 200 } });
    expect(run()).toMatchObject({ nextCalled: false, result: { statusCode: 429, retryAfter: "5", body: { error: "Too many requests. Please try again later." } } });
    expect(run("GET")).toMatchObject({ nextCalled: true, result: { statusCode: 200 } });

    now += 5_000;
    expect(run()).toMatchObject({ nextCalled: true, result: { statusCode: 200 } });
  });

  it("accepts same-origin mutations and rejects missing or cross-site origins", () => {
    const run = (origin?: string) => {
      const { result, response } = responseRecorder();
      let nextCalled = false;
      requireSameOriginMutation({ method: "POST", protocol: "https", headers: { host: "vaultlooms.vercel.app", ...(origin ? { origin } : {}) } } as never, response as never, () => { nextCalled = true; });
      return { result, nextCalled };
    };

    expect(run("https://vaultlooms.vercel.app").nextCalled).toBe(true);
    expect(run().result).toMatchObject({ statusCode: 403, body: { error: "Cross-site requests are not permitted." } });
    expect(run("https://attacker.example").result).toMatchObject({ statusCode: 403, body: { error: "Cross-site requests are not permitted." } });
  });

  it("can also bound sign-in initiation requests that use GET redirects", () => {
    const limit = createMutationRateLimiter({ limit: 1, windowMs: 5_000, unsafeMethodsOnly: false });
    const run = () => {
      const { result, response } = responseRecorder();
      let nextCalled = false;
      limit({ method: "GET", headers: { "x-forwarded-for": "198.51.100.9" } } as never, response as never, () => { nextCalled = true; });
      return { result, nextCalled };
    };

    expect(run().nextCalled).toBe(true);
    expect(run().result).toMatchObject({ statusCode: 429, body: { error: "Too many requests. Please try again later." } });
  });
});

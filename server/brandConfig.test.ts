import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

describe("managed brand title", () => {
  it("exposes the configured Vaultloom title through the lightweight health API", async () => {
    const caller = appRouter.createCaller({
      user: null,
      req: { protocol: "https", headers: {} } as TrpcContext["req"],
      res: {} as TrpcContext["res"],
    });
    const health = await caller.system.health({ timestamp: Date.now() });
    expect(health).toEqual({ ok: true, appTitle: "Vaultloom" });
  });
});

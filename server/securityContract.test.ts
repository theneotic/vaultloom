import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const projectFile = (path: string) => readFileSync(resolve(import.meta.dirname, "..", path), "utf8");

describe("production security contract", () => {
  it("keeps request sizes bounded and protects sensitive API entry points", () => {
    const app = projectFile("server/app.ts");
    const security = projectFile("server/security.ts");

    expect(app).toContain('app.disable("x-powered-by")');
    expect(app).toContain('express.json({ limit: "3mb" })');
    expect(app).toContain("requireSameOriginMutation, apiMutationRateLimit");
    expect(app).toContain('app.use("/api/auth/github", githubAuthRateLimit)');
    expect(security).toContain("Too many requests. Please try again later.");
  });

  it("keeps deployment error, cookie, and browser-header controls in place", () => {
    const cookies = projectFile("server/_core/cookies.ts");
    const trpc = projectFile("server/_core/trpc.ts");
    const errorBoundary = projectFile("client/src/components/ErrorBoundary.tsx");
    const vercel = projectFile("vercel.json");

    expect(cookies).toContain('httpOnly: true');
    expect(cookies).toContain('sameSite: "lax"');
    expect(cookies).toContain("secure: isSecureRequest(req)");
    expect(trpc).toContain("The request could not be completed.");
    expect(errorBoundary).toContain("import.meta.env.DEV");
    expect(vercel).toContain("Content-Security-Policy");
    expect(vercel).toContain("Strict-Transport-Security");
    expect(vercel).toContain("X-Frame-Options");
  });

  it("does not offer unactionable production sign-in while reporting is deferred", () => {
    const reportForm = projectFile("client/src/components/VulnerabilityReportForm.tsx");
    const router = projectFile("server/routers.ts");
    const availability = projectFile("server/reportingAvailability.ts");

    expect(reportForm).toContain("vulnerabilityReports.status.useQuery");
    expect(reportForm).toContain("Private reporting is currently unavailable");
    expect(reportForm).not.toContain('onClick={startLogin}');
    expect(router).toContain("status: publicProcedure.query");
    expect(router).toContain("if (!isReportingConfigured())");
    expect(availability).toContain("BLOB_READ_WRITE_TOKEN");
  });
});

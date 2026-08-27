import { describe, expect, it } from "vitest";
import { isReportingConfigured } from "./reportingAvailability";

const completeEnvironment = {
  APP_ORIGIN: "https://vaultlooms.vercel.app",
  AUTH_SECRET: "a-secure-unique-signing-secret-with-more-than-32-bytes",
  GITHUB_CLIENT_ID: "client-id",
  GITHUB_CLIENT_SECRET: "client-secret",
  DATABASE_URL: "mysql://vaultloom:password@db.example/vaultloom",
  BLOB_READ_WRITE_TOKEN: "vercel_blob_rw_token",
};

describe("reporting availability", () => {
  it("requires every server-side reporting dependency", () => {
    expect(isReportingConfigured(completeEnvironment)).toBe(true);
    expect(isReportingConfigured({ ...completeEnvironment, BLOB_READ_WRITE_TOKEN: undefined })).toBe(false);
    expect(isReportingConfigured({ ...completeEnvironment, DATABASE_URL: "" })).toBe(false);
  });

  it("rejects a missing or short session-signing secret", () => {
    expect(isReportingConfigured({ ...completeEnvironment, AUTH_SECRET: undefined })).toBe(false);
    expect(isReportingConfigured({ ...completeEnvironment, AUTH_SECRET: "short" })).toBe(false);
  });
});

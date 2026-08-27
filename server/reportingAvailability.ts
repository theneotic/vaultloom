type ReportingEnvironment = Record<string, string | undefined>;

const requiredVariables = [
  "APP_ORIGIN",
  "AUTH_SECRET",
  "GITHUB_CLIENT_ID",
  "GITHUB_CLIENT_SECRET",
  "DATABASE_URL",
  "BLOB_READ_WRITE_TOKEN",
] as const;

/**
 * Reports are enabled only when every server-side dependency has been supplied.
 * The result never discloses which value is absent or exposes any secret.
 */
export function isReportingConfigured(env: ReportingEnvironment = process.env) {
  const authSecret = env.AUTH_SECRET?.trim();
  return Boolean(
    authSecret
    && Buffer.byteLength(authSecret) >= 32
    && requiredVariables.every(variable => Boolean(env[variable]?.trim())),
  );
}

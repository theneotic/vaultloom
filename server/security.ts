import type { NextFunction, Request, RequestHandler, Response } from "express";

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

type RateLimitOptions = {
  limit: number;
  windowMs: number;
  now?: () => number;
  unsafeMethodsOnly?: boolean;
};

type RateLimitBucket = {
  count: number;
  resetAt: number;
};

function configuredOrigin() {
  const value = process.env.APP_ORIGIN?.trim();
  if (!value) return null;

  const parsed = new URL(value);
  if (parsed.protocol !== "https:" && parsed.hostname !== "localhost") {
    throw new Error("APP_ORIGIN must use HTTPS outside local development.");
  }
  return parsed.origin;
}

function requestOrigin(req: Request) {
  const forwardedProto = req.headers["x-forwarded-proto"];
  const protocol = typeof forwardedProto === "string"
    ? forwardedProto.split(",")[0].trim()
    : req.protocol || "https";
  const forwardedHost = req.headers["x-forwarded-host"];
  const host = typeof forwardedHost === "string"
    ? forwardedHost.split(",")[0].trim()
    : req.headers.host;

  if (!host) throw new Error("Request host is missing.");
  return `${protocol}://${host}`;
}

function requestIdentifier(req: Request) {
  const forwardedFor = req.headers["x-forwarded-for"];
  if (typeof forwardedFor === "string") return forwardedFor.split(",")[0].trim() || "unknown";
  return req.ip || "unknown";
}

/**
 * Baseline, per-instance abuse protection. Vercel WAF or an edge rate limiter
 * is still required for a distributed production limit.
 */
export function createMutationRateLimiter({ limit, windowMs, now = Date.now, unsafeMethodsOnly = true }: RateLimitOptions): RequestHandler {
  const buckets = new Map<string, RateLimitBucket>();

  return (req, res, next) => {
    if (unsafeMethodsOnly && SAFE_METHODS.has(req.method)) return next();

    const currentTime = now();
    const key = requestIdentifier(req);
    const existing = buckets.get(key);
    const bucket = !existing || existing.resetAt <= currentTime
      ? { count: 0, resetAt: currentTime + windowMs }
      : existing;

    if (buckets.size > 5_000) {
      for (const [entryKey, entry] of Array.from(buckets.entries())) {
        if (entry.resetAt <= currentTime) buckets.delete(entryKey);
      }
    }

    if (bucket.count >= limit) {
      res.setHeader("Retry-After", String(Math.max(1, Math.ceil((bucket.resetAt - currentTime) / 1000))));
      res.status(429).json({ error: "Too many requests. Please try again later." });
      return;
    }

    bucket.count += 1;
    buckets.set(key, bucket);
    next();
  };
}

/** Blocks browser-initiated cross-site state changes made with cookie credentials. */
export const requireSameOriginMutation: RequestHandler = (req, res, next) => {
  if (SAFE_METHODS.has(req.method)) return next();

  const origin = req.headers.origin;
  try {
    const expectedOrigin = configuredOrigin() ?? requestOrigin(req);
    if (typeof origin !== "string" || new URL(origin).origin !== expectedOrigin) {
      res.status(403).json({ error: "Cross-site requests are not permitted." });
      return;
    }
  } catch {
    res.status(403).json({ error: "Cross-site requests are not permitted." });
    return;
  }

  next();
};

export const apiMutationRateLimit = createMutationRateLimiter({ limit: 60, windowMs: 10 * 60 * 1000 });
export const githubAuthRateLimit = createMutationRateLimiter({ limit: 20, windowMs: 10 * 60 * 1000, unsafeMethodsOnly: false });

/** Applies a safe baseline for local development and API Function responses. */
export function applyApiSecurityHeaders(_req: Request, res: Response, next: NextFunction) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  next();
}

export function getConfiguredAppOrigin() {
  return configuredOrigin();
}

import { SignJWT, jwtVerify } from "jose";
import { parse as parseCookieHeader } from "cookie";
import { timingSafeEqual } from "node:crypto";
import type { Express, Request, Response } from "express";
import type { User } from "../../drizzle/schema";
import { COOKIE_NAME, ONE_YEAR_MS } from "../../shared/const";
import * as db from "../db";
import { getSessionCookieOptions } from "../_core/cookies";
import { getConfiguredAppOrigin } from "../security";

const GITHUB_AUTHORIZE_URL = "https://github.com/login/oauth/authorize";
const GITHUB_TOKEN_URL = "https://github.com/login/oauth/access_token";
const GITHUB_USER_URL = "https://api.github.com/user";
const GITHUB_EMAILS_URL = "https://api.github.com/user/emails";
const OAUTH_STATE_COOKIE = "vaultloom_github_oauth_state";
const OAUTH_STATE_TTL_MS = 10 * 60 * 1000;

type GitHubTokenResponse = { access_token?: string; error?: string; error_description?: string };
type GitHubUser = { id: number; login: string; name: string | null; email: string | null };
type GitHubEmail = { email: string; primary: boolean; verified: boolean };
type SessionPayload = { openId: string; name: string };

function getRequiredEnv(name: "AUTH_SECRET" | "GITHUB_CLIENT_ID" | "GITHUB_CLIENT_SECRET") {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not configured`);
  if (name === "AUTH_SECRET" && Buffer.byteLength(value) < 32) {
    throw new Error("AUTH_SECRET must contain at least 32 bytes.");
  }
  return value;
}

function getRequestOrigin(req: Request) {
  const configured = getConfiguredAppOrigin();
  if (configured) return configured;
  if (process.env.NODE_ENV === "production") throw new Error("APP_ORIGIN is not configured");
  const forwardedProto = req.headers["x-forwarded-proto"];
  const protocol = typeof forwardedProto === "string"
    ? forwardedProto.split(",")[0].trim()
    : req.protocol || "https";
  const host = req.headers.host;
  if (!host) throw new Error("Request host is missing");
  return `${protocol}://${host}`;
}

function secureEquals(left: string, right: string) {
  const leftBytes = Buffer.from(left);
  const rightBytes = Buffer.from(right);
  return leftBytes.length === rightBytes.length && timingSafeEqual(leftBytes, rightBytes);
}

function oauthStateCookieOptions(req: Request) {
  return {
    httpOnly: true,
    path: "/",
    sameSite: "lax" as const,
    secure: getSessionCookieOptions(req).secure,
    maxAge: OAUTH_STATE_TTL_MS,
  };
}

async function createSessionToken(payload: SessionPayload) {
  const secret = new TextEncoder().encode(getRequiredEnv("AUTH_SECRET"));
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setSubject(payload.openId)
    .setIssuedAt()
    .setExpirationTime(Math.floor((Date.now() + ONE_YEAR_MS) / 1000))
    .sign(secret);
}

async function readSessionToken(token: string | undefined): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const secret = new TextEncoder().encode(getRequiredEnv("AUTH_SECRET"));
    const { payload } = await jwtVerify(token, secret, { algorithms: ["HS256"] });
    if (typeof payload.openId !== "string" || typeof payload.name !== "string") return null;
    return { openId: payload.openId, name: payload.name };
  } catch {
    return null;
  }
}

export async function authenticateRequest(req: Request): Promise<User> {
  const cookies = parseCookieHeader(req.headers.cookie ?? "");
  const session = await readSessionToken(cookies[COOKIE_NAME]);
  if (!session) throw new Error("Invalid or missing session");
  const user = await db.getUserByOpenId(session.openId);
  if (!user) throw new Error("Authenticated user is unavailable");
  await db.upsertUser({ openId: user.openId, lastSignedIn: new Date() });
  return user;
}

async function githubRequest<T>(url: string, accessToken: string): Promise<T> {
  const response = await fetch(url, {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${accessToken}`,
      "User-Agent": "Vaultloom",
    },
  });
  if (!response.ok) throw new Error(`GitHub profile request failed (${response.status})`);
  return response.json() as Promise<T>;
}

async function getPrimaryEmail(accessToken: string, profile: GitHubUser) {
  if (profile.email) return profile.email;
  const emails = await githubRequest<GitHubEmail[]>(GITHUB_EMAILS_URL, accessToken);
  return emails.find(email => email.primary && email.verified)?.email
    ?? emails.find(email => email.verified)?.email
    ?? null;
}

export function registerGitHubOAuthRoutes(app: Express) {
  app.get("/api/auth/github/login", (req, res) => {
    if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET || !process.env.AUTH_SECRET) {
      res.status(503).json({ error: "GitHub sign-in is not configured for this deployment." });
      return;
    }
    const state = crypto.randomUUID();
    const redirectUri = `${getRequestOrigin(req)}/api/auth/github/callback`;
    res.cookie(OAUTH_STATE_COOKIE, state, oauthStateCookieOptions(req));
    const authorizeUrl = new URL(GITHUB_AUTHORIZE_URL);
    authorizeUrl.searchParams.set("client_id", process.env.GITHUB_CLIENT_ID);
    authorizeUrl.searchParams.set("redirect_uri", redirectUri);
    authorizeUrl.searchParams.set("scope", "read:user user:email");
    authorizeUrl.searchParams.set("state", state);
    res.redirect(302, authorizeUrl.toString());
  });

  app.get("/api/auth/github/callback", async (req: Request, res: Response) => {
    const code = typeof req.query.code === "string" ? req.query.code : undefined;
    const state = typeof req.query.state === "string" ? req.query.state : undefined;
    const expectedState = parseCookieHeader(req.headers.cookie ?? "")[OAUTH_STATE_COOKIE];
    if (!code || !state || !expectedState || !secureEquals(state, expectedState)) {
      res.status(403).json({ error: "Invalid GitHub OAuth state." });
      return;
    }
    res.clearCookie(OAUTH_STATE_COOKIE, oauthStateCookieOptions(req));

    try {
      const tokenResponse = await fetch(GITHUB_TOKEN_URL, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: getRequiredEnv("GITHUB_CLIENT_ID"),
          client_secret: getRequiredEnv("GITHUB_CLIENT_SECRET"),
          code,
          redirect_uri: `${getRequestOrigin(req)}/api/auth/github/callback`,
        }),
      });
      const token = await tokenResponse.json() as GitHubTokenResponse;
      if (!tokenResponse.ok || !token.access_token) throw new Error(token.error_description ?? token.error ?? "GitHub token exchange failed");

      const profile = await githubRequest<GitHubUser>(GITHUB_USER_URL, token.access_token);
      const openId = `github:${profile.id}`;
      const name = profile.name?.trim() || profile.login;
      await db.upsertUser({
        openId,
        name,
        email: await getPrimaryEmail(token.access_token, profile),
        loginMethod: "github",
        lastSignedIn: new Date(),
      });
      const user = await db.getUserByOpenId(openId);
      if (!user) throw new Error("The configured database is unavailable.");
      const session = await createSessionToken({ openId, name });
      res.cookie(COOKIE_NAME, session, { ...getSessionCookieOptions(req), maxAge: ONE_YEAR_MS });
      res.redirect(302, "/contact");
    } catch {
      console.error("[GitHub OAuth] Callback failed");
      res.status(500).json({ error: "GitHub sign-in could not be completed." });
    }
  });
}

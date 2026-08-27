import express, { type Express } from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerGitHubOAuthRoutes } from "./auth/portableAuth";
import { getBrandAssetUrl, isBrandAsset } from "./brandAssets";
import { createContext } from "./_core/context";
import { appRouter } from "./routers";
import { apiMutationRateLimit, applyApiSecurityHeaders, githubAuthRateLimit, requireSameOriginMutation } from "./security";

export function createApp(): Express {
  const app = express();
  app.disable("x-powered-by");
  app.set("trust proxy", 1);
  app.use(applyApiSecurityHeaders);
  app.use("/api/trpc", requireSameOriginMutation, apiMutationRateLimit);
  app.use("/api/auth/github", githubAuthRateLimit);
  app.use(express.json({ limit: "3mb" }));
  app.use(express.urlencoded({ limit: "32kb", extended: false, parameterLimit: 50 }));
  app.get("/api/brand/:asset", (req, res) => {
    const asset = req.params.asset;
    if (!isBrandAsset(asset)) return res.status(404).json({ error: "Unknown brand asset." });
    const location = getBrandAssetUrl(asset);
    if (!location) return res.status(503).json({ error: "Brand image storage is not configured." });
    res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=86400");
    return res.redirect(307, location);
  });
  registerGitHubOAuthRoutes(app);
  app.use("/api/trpc", createExpressMiddleware({ router: appRouter, createContext }));
  return app;
}

import { COOKIE_NAME } from "@shared/const";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createVulnerabilityReport } from "./db";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { allowedAttachmentTypes, decodeAttachment } from "./reportValidation";
import { isReportingConfigured } from "./reportingAvailability";
import { storagePut } from "./storage";

const attachmentSchema = z.object({
  name: z.string().trim().min(1).max(128),
  type: z.enum(allowedAttachmentTypes),
  dataBase64: z.string().max(2_800_000),
});

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),
  vulnerabilityReports: router({
    status: publicProcedure.query(() => ({ available: isReportingConfigured() })),
    /** Requires an authenticated reporter and rejects arbitrary executables, archives, and oversized evidence. */
    submit: protectedProcedure
      .input(z.object({
        title: z.string().trim().min(10).max(140),
        severity: z.enum(["low", "medium", "high", "critical"]),
        details: z.string().trim().min(40).max(12_000),
        attachment: attachmentSchema.nullable(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (!isReportingConfigured()) {
          throw new TRPCError({ code: "FORBIDDEN", message: "Vulnerability reporting is not configured." });
        }
        if (/\b(password|recovery code|api key|access token|private key)\b/i.test(`${input.title}\n${input.details}`)) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Remove live passwords, recovery codes, keys, and tokens before submitting.",
          });
        }

        const decoded = input.attachment ? decodeAttachment(input.attachment) : null;
        const uploaded = decoded
          ? await storagePut(
            `vulnerability-reports/${ctx.user.id}/${crypto.randomUUID()}.${decoded.extension}`,
            decoded.bytes,
            decoded.type,
          )
          : null;

        const reportId = await createVulnerabilityReport({
          reporterUserId: ctx.user.id,
          title: input.title,
          severity: input.severity,
          details: input.details,
          attachmentKey: uploaded?.key,
          attachmentName: decoded?.safeName,
          attachmentMimeType: decoded?.type,
          attachmentBytes: decoded?.bytes.length,
        });

        return { reportId, status: "submitted" as const };
      }),
  }),
});

export type AppRouter = typeof appRouter;

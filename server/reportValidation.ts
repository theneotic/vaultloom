/** Security boundaries for optional report evidence: authenticated, small, safe-type attachments only. */
import { TRPCError } from "@trpc/server";

export const MAX_ATTACHMENT_BYTES = 2 * 1024 * 1024;
export const allowedAttachmentTypes = [
  "text/plain",
  "application/json",
  "image/png",
  "image/jpeg",
] as const;
export type AllowedAttachmentType = (typeof allowedAttachmentTypes)[number];

const extensionByMimeType: Record<AllowedAttachmentType, string> = {
  "text/plain": "txt",
  "application/json": "json",
  "image/png": "png",
  "image/jpeg": "jpg",
};

export type DecodedAttachment = {
  safeName: string;
  type: AllowedAttachmentType;
  bytes: Buffer;
  extension: string;
};

function invalidAttachment(message: string): never {
  throw new TRPCError({ code: "BAD_REQUEST", message });
}

export function decodeAttachment(input: {
  name: string;
  type: AllowedAttachmentType;
  dataBase64: string;
}): DecodedAttachment {
  const compact = input.dataBase64.replace(/\s/g, "");
  if (
    !compact ||
    compact.length % 4 !== 0 ||
    !/^[A-Za-z0-9+/]*={0,2}$/.test(compact)
  ) {
    invalidAttachment("The attachment data is not valid base64.");
  }
  const bytes = Buffer.from(compact, "base64");
  if (!bytes.length || bytes.length > MAX_ATTACHMENT_BYTES) {
    invalidAttachment("Attachments must be between 1 byte and 2 MB.");
  }

  const safeStem =
    input.name
      .replace(/\.[^.]+$/, "")
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .replace(/_+/g, "_")
      .replace(/^_+|_+$/g, "")
      .slice(0, 96) || "evidence";

  return {
    safeName: `${safeStem}.${extensionByMimeType[input.type]}`,
    type: input.type,
    bytes,
    extension: extensionByMimeType[input.type],
  };
}

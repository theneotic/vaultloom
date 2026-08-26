import { put } from "@vercel/blob";

function normalizeKey(relKey: string) {
  return relKey.replace(/^\/+/, "");
}

function appendHashSuffix(relKey: string) {
  const hash = crypto.randomUUID().replace(/-/g, "").slice(0, 8);
  const lastDot = relKey.lastIndexOf(".");
  return lastDot === -1
    ? `${relKey}_${hash}`
    : `${relKey.slice(0, lastDot)}_${hash}${relKey.slice(lastDot)}`;
}

function getBlobToken() {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) throw new Error("BLOB_READ_WRITE_TOKEN is not configured.");
  return token;
}

export async function storagePut(
  relKey: string,
  data: Buffer | Uint8Array | string,
  contentType = "application/octet-stream"
) {
  const body = typeof data === "string" ? data : Buffer.from(data);
  const blob = await put(appendHashSuffix(normalizeKey(relKey)), body, {
    access: "private",
    contentType,
    token: getBlobToken(),
  });
  return { key: blob.pathname, url: blob.url };
}

export async function storageGet(relKey: string) {
  const key = normalizeKey(relKey);
  return { key, url: key };
}

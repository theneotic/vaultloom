import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { put } from "@vercel/blob";

const sourceRoot = "/home/ubuntu/webdev-static-assets";
const assets = [
  ["slaysecure-pro-mark.png", "vaultloom/brand/mark.png"],
  ["slaysecure-pro-texture.png", "vaultloom/brand/texture.png"],
  ["slaysecure-pro-generator-art.png", "vaultloom/brand/generator-art.png"],
];

if (!process.env.BLOB_READ_WRITE_TOKEN) {
  throw new Error("BLOB_READ_WRITE_TOKEN must be set before seeding Vaultloom brand assets.");
}

const uploaded = await Promise.all(assets.map(async ([source, destination]) => {
  const bytes = await readFile(resolve(sourceRoot, source));
  const blob = await put(destination, bytes, {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "image/png",
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });
  return { destination, url: blob.url };
}));

console.table(uploaded);

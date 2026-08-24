import { describe, expect, it } from "vitest";
import { MAX_ATTACHMENT_BYTES, decodeAttachment } from "./reportValidation";

describe("decodeAttachment", () => {
  it("sanitizes the client filename and decodes allowed evidence", () => {
    const attachment = decodeAttachment({
      name: "../proof of concept!!.txt",
      type: "text/plain",
      dataBase64: Buffer.from("reproduction steps", "utf8").toString("base64"),
    });
    expect(attachment.safeName).toBe("proof_of_concept.txt");
    expect(attachment.type).toBe("text/plain");
    expect(attachment.bytes.toString("utf8")).toBe("reproduction steps");
  });

  it("rejects malformed, empty, and over-limit attachment data", () => {
    expect(() => decodeAttachment({ name: "bad.txt", type: "text/plain", dataBase64: "not:base64" })).toThrow();
    expect(() => decodeAttachment({ name: "empty.txt", type: "text/plain", dataBase64: "" })).toThrow();
    const tooLarge = Buffer.alloc(MAX_ATTACHMENT_BYTES + 1).toString("base64");
    expect(() => decodeAttachment({ name: "large.txt", type: "text/plain", dataBase64: tooLarge })).toThrow();
  });
});

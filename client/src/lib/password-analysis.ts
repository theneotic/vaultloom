/* Cipher Atelier: lazily loaded local zxcvbn-ts guessability estimator. */
import { ZxcvbnFactory } from "@zxcvbn-ts/core";
import * as common from "@zxcvbn-ts/language-common";
import * as english from "@zxcvbn-ts/language-en";

const MAX_ANALYSIS_LENGTH = 256;

const zxcvbn = new ZxcvbnFactory({
  translations: english.translations,
  graphs: common.adjacencyGraphs,
  dictionary: {
    ...common.dictionary,
    ...english.dictionary,
    userInputs: ["slaysecure", "slay secure", "password workbench"],
  },
  useLevenshteinDistance: true,
});

export type PasswordAnalysis = ReturnType<typeof zxcvbn.check>;

export function analyzePassword(password: string, userInputs: string[] = []): PasswordAnalysis {
  if (typeof password !== "string") throw new TypeError("password must be a string");
  const context = userInputs
    .filter((input): input is string => typeof input === "string")
    .map((input) => input.trim())
    .filter(Boolean);
  return zxcvbn.check(password.slice(0, MAX_ANALYSIS_LENGTH), context);
}

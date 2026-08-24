/* Cipher Atelier security core: unbiased browser generator and display primitives. */

export const strengthScale = [
  { label: "Too guessable", tone: "text-rose-300", rail: "bg-rose-400" },
  { label: "Fragile", tone: "text-orange-300", rail: "bg-orange-400" },
  { label: "Fair", tone: "text-amber-300", rail: "bg-amber-300" },
  { label: "Resilient", tone: "text-sky-300", rail: "bg-sky-400" },
  { label: "Strong", tone: "text-emerald-300", rail: "bg-emerald-400" },
] as const;

export const characterSets = {
  lowercase: "abcdefghijkmnopqrstuvwxyz",
  uppercase: "ABCDEFGHJKLMNPQRSTUVWXYZ",
  numbers: "23456789",
  symbols: "!@#$%^&*+=?_-",
} as const;

export type CharacterSet = keyof typeof characterSets;

const UINT32_RANGE = 0x1_0000_0000;

type RandomValues = (array: Uint32Array) => Uint32Array;

function browserRandomValues(array: Uint32Array): Uint32Array {
  if (!globalThis.crypto?.getRandomValues) {
    throw new Error("Web Crypto is unavailable in this browser");
  }
  return globalThis.crypto.getRandomValues(array);
}

/**
 * Returns a uniform integer in [0, maxExclusive) using rejection sampling.
 * The injected random source supports deterministic verification without changing production behavior.
 */
export function secureRandomInt(maxExclusive: number, randomValues: RandomValues = browserRandomValues): number {
  if (!Number.isSafeInteger(maxExclusive) || maxExclusive <= 0 || maxExclusive > UINT32_RANGE) {
    throw new RangeError("maxExclusive must be an integer from 1 through 2^32");
  }
  const limit = Math.floor(UINT32_RANGE / maxExclusive) * maxExclusive;
  const sample = new Uint32Array(1);
  do {
    randomValues(sample);
  } while (sample[0] >= limit);
  return sample[0] % maxExclusive;
}

export function generatePassword(length: number, selected: CharacterSet[]): string {
  const uniqueSelected: CharacterSet[] = selected.filter((name, index) => selected.indexOf(name) === index);
  if (!Number.isInteger(length) || length < 12 || length > 64) {
    throw new RangeError("length must be an integer from 12 through 64");
  }
  if (uniqueSelected.length === 0) return "";
  if (uniqueSelected.length > length) {
    throw new RangeError("length must cover every selected character family");
  }

  const permitted = uniqueSelected.map((name) => characterSets[name]).join("");
  const output = uniqueSelected.map((name) => characterSets[name][secureRandomInt(characterSets[name].length)]);
  while (output.length < length) output.push(permitted[secureRandomInt(permitted.length)]);

  for (let index = output.length - 1; index > 0; index -= 1) {
    const swapIndex = secureRandomInt(index + 1);
    [output[index], output[swapIndex]] = [output[swapIndex], output[index]];
  }
  return output.join("");
}

export function formatGuesses(guesses: number): string {
  if (guesses >= 1_000_000_000_000) return `${(guesses / 1_000_000_000_000).toFixed(1)}T+`;
  if (guesses >= 1_000_000_000) return `${(guesses / 1_000_000_000).toFixed(1)}B`;
  if (guesses >= 1_000_000) return `${(guesses / 1_000_000).toFixed(1)}M`;
  if (guesses >= 1_000) return `${(guesses / 1_000).toFixed(1)}K`;
  return guesses.toLocaleString();
}

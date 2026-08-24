import { describe, expect, test } from "vitest";
import {
  characterSets,
  generatePassword,
  secureRandomInt,
} from "./password-security";
import { analyzePassword } from "./password-analysis";

describe("secureRandomInt", () => {
  test("rejects the incomplete uint32 tail before reducing modulo", () => {
    const values = [0xffffffff, 3];
    const result = secureRandomInt(10, (array) => {
      array[0] = values.shift() ?? 0;
      return array;
    });
    expect(result).toBe(3);
    expect(values).toHaveLength(0);
  });

  test.each([0, -1, 1.5, Number.NaN, 0x1_0000_0001])("rejects invalid range %s", (range) => {
    expect(() => secureRandomInt(range)).toThrow(RangeError);
  });
});

describe("generatePassword", () => {
  const allFamilies = ["lowercase", "uppercase", "numbers", "symbols"] as const;

  test("returns exact requested length and every requested family", () => {
    const password = generatePassword(24, [...allFamilies]);
    expect(password).toHaveLength(24);
    expect([...password].some((character) => characterSets.lowercase.includes(character))).toBe(true);
    expect([...password].some((character) => characterSets.uppercase.includes(character))).toBe(true);
    expect([...password].some((character) => characterSets.numbers.includes(character))).toBe(true);
    expect([...password].some((character) => characterSets.symbols.includes(character))).toBe(true);
  });

  test("returns empty output when no family is selected", () => {
    expect(generatePassword(18, [])).toBe("");
  });

  test.each([0, 11, 12.5, 65])("rejects invalid length %s", (length) => {
    expect(() => generatePassword(length, ["lowercase"])).toThrow(RangeError);
  });
});

describe("analyzePassword", () => {
  test("recognizes a common password as weak", () => {
    expect(analyzePassword("password").score).toBeLessThanOrEqual(1);
  });

  test("rates a varied long candidate above a common password", () => {
    const weak = analyzePassword("password123");
    const stronger = analyzePassword("vR7!mQ2#xL9@pT4$zK8^nC6&");
    expect(stronger.score).toBeGreaterThan(weak.score);
    expect(stronger.guesses).toBeGreaterThan(weak.guesses);
  });
});

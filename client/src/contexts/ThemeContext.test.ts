import { describe, expect, it } from "vitest";
import { nextTheme, resolveThemePreference, THEME_STORAGE_KEY } from "./ThemeContext";

describe("theme preference helpers", () => {
  it("keeps a stored explicit preference over the operating-system preference", () => {
    expect(resolveThemePreference("light", true, "dark")).toBe("light");
    expect(resolveThemePreference("dark", false, "light")).toBe("dark");
  });

  it("uses the system preference when no stored selection exists", () => {
    expect(resolveThemePreference(null, true, "light")).toBe("dark");
    expect(resolveThemePreference(null, false, "dark")).toBe("light");
  });

  it("flips between accessible light and dark modes", () => {
    expect(nextTheme("light")).toBe("dark");
    expect(nextTheme("dark")).toBe("light");
  });

  it("uses a Vaultloom-specific persisted preference key", () => {
    expect(THEME_STORAGE_KEY).toBe("vaultloom-theme");
  });
});

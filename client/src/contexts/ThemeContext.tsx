import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "vaultloom-theme";
const LEGACY_THEME_STORAGE_KEY = "slaysecure-theme";

export function resolveThemePreference(
  stored: string | null,
  systemPrefersDark: boolean,
  fallback: Theme
): Theme {
  if (stored === "light" || stored === "dark") return stored;
  if (typeof stored === "string") return fallback;
  return systemPrefersDark ? "dark" : "light";
}

export function nextTheme(theme: Theme): Theme {
  return theme === "light" ? "dark" : "light";
}

interface ThemeContextType {
  theme: Theme;
  toggleTheme?: () => void;
  switchable: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  switchable?: boolean;
}

export function ThemeProvider({
  children,
  defaultTheme = "light",
  switchable = false,
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return defaultTheme;
    if (switchable) {
      const stored =
        localStorage.getItem(THEME_STORAGE_KEY) ??
        localStorage.getItem(LEGACY_THEME_STORAGE_KEY);
      return resolveThemePreference(
        stored,
        window.matchMedia("(prefers-color-scheme: dark)").matches,
        defaultTheme
      );
    }
    return defaultTheme;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    root.style.colorScheme = theme;

    if (switchable) {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
      localStorage.removeItem(LEGACY_THEME_STORAGE_KEY);
    }
  }, [theme, switchable]);

  const toggleTheme = switchable
    ? () => {
        setTheme(nextTheme);
      }
    : undefined;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, switchable }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}

import { getStorageItem, setStorageItem, THEME } from "./local-storage";

export type Theme = "light" | "dark" | "system";

export function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function resolveTheme(theme: Theme): "light" | "dark" {
  return theme === "system" ? getSystemTheme() : theme;
}

export function getStoredTheme(): Theme {
  const stored = getStorageItem(THEME);
  if (stored === "light" || stored === "dark" || stored === "system")
    return stored;
  return "system";
}

export function applyTheme(theme: Theme) {
  const resolved = resolveTheme(theme);
  document.documentElement.classList.remove("light", "dark");
  document.documentElement.classList.add(resolved);
  setStorageItem(THEME, theme);
}

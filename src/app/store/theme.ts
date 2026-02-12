import { create } from "zustand";

export type Theme = "light" | "dark" | "system";

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

function getThemeCookie(): Theme {
  if (typeof document === "undefined") return "system";
  const match = document.cookie.match(/(?:^|;\s*)theme=(\w+)/);
  return (match?.[1] as Theme) || "system";
}

function setThemeCookie(theme: Theme) {
  document.cookie = `theme=${theme};path=/;max-age=${60 * 60 * 24 * 365};SameSite=Lax`;
}

export function resolveThemeClass(theme: Theme): "dark" | "light" {
  if (theme === "system") {
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return "light";
  }
  return theme;
}

function applyTheme(theme: Theme) {
  if (typeof window === "undefined") return;
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(resolveThemeClass(theme));
  setThemeCookie(theme);
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: getThemeCookie(),
  setTheme: (theme) => {
    applyTheme(theme);
    set({ theme });
  },
}));

if (typeof window !== "undefined") {
  applyTheme(getThemeCookie());

  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", () => {
      const current = useThemeStore.getState().theme;
      if (current === "system") applyTheme("system");
    });
}

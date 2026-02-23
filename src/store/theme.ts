import { create } from "zustand";
import { applyTheme, type Theme } from "~/lib/theme";

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: "system", // consistent on server and client — avoids hydration mismatch
  setTheme: (theme) => {
    applyTheme(theme);
    set({ theme });
  },
}));

// One system-preference watcher for the whole app, lives here
if (typeof window !== "undefined") {
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", () => {
      const { theme, setTheme } = useThemeStore.getState();
      if (theme === "system") setTheme("system");
    });
}

import { useEffect, useState } from "react";

export type ThemeMode = "light" | "dark" | "system";

export function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function applyTheme(mode: ThemeMode) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  const effectiveTheme = mode === "system" ? getSystemTheme() : mode;

  if (effectiveTheme === "dark") {
    root.classList.add("dark");
    root.setAttribute("data-theme", "dark");
  } else {
    root.classList.remove("dark");
    root.setAttribute("data-theme", "light");
  }
}

export function useTheme() {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    if (typeof window === "undefined") return "system";
    const saved = localStorage.getItem("shakerfy_theme") as ThemeMode | null;
    return saved || "system";
  });

  const setTheme = (newMode: ThemeMode) => {
    setThemeState(newMode);
    localStorage.setItem("shakerfy_theme", newMode);
    applyTheme(newMode);
  };

  useEffect(() => {
    // Apply theme on mount
    applyTheme(theme);

    // Listen for OS system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (theme === "system") {
        applyTheme("system");
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  return {
    theme,
    setTheme,
    effectiveTheme: theme === "system" ? getSystemTheme() : theme,
  };
}

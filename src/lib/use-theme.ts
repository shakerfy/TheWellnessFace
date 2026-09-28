import { useEffect, useState } from "react";

export type ThemeMode = "light" | "dark" | "system";

export function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function applyTheme(mode?: ThemeMode) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.classList.remove("athlete-mode");
  const resolvedMode =
    mode || ((localStorage.getItem("shakerfy_theme") as ThemeMode | null) ?? "system");
  const effectiveTheme = resolvedMode === "system" ? getSystemTheme() : resolvedMode;

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
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("shakerfy:theme-updated", { detail: newMode }));
    }
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

    const handleCustomThemeChange = (e: Event) => {
      const customEvent = e as CustomEvent<ThemeMode>;
      if (customEvent.detail) {
        setThemeState(customEvent.detail);
      } else {
        const saved = (localStorage.getItem("shakerfy_theme") as ThemeMode | null) || "system";
        setThemeState(saved);
      }
    };

    const handleNutritionModeChange = () => {
      applyTheme(theme);
    };

    mediaQuery.addEventListener("change", handleChange);
    window.addEventListener("shakerfy:theme-updated", handleCustomThemeChange);
    window.addEventListener("shakerfy_nutrition_settings_updated", handleNutritionModeChange);
    window.addEventListener("storage", handleCustomThemeChange);
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
      window.removeEventListener("shakerfy:theme-updated", handleCustomThemeChange);
      window.removeEventListener("shakerfy_nutrition_settings_updated", handleNutritionModeChange);
      window.removeEventListener("storage", handleCustomThemeChange);
    };
  }, [theme]);

  return {
    theme,
    setTheme,
    effectiveTheme: theme === "system" ? getSystemTheme() : theme,
  };
}

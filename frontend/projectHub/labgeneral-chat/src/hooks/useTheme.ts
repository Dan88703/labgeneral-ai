import { useCallback, useEffect, useState } from "react";
import { THEME_STORAGE_KEY } from "@/lib/constants";

type Theme = "light" | "dark";

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "dark";

  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === "light" || stored === "dark") return stored;

  // Aplikacja domyślnie startuje w trybie ciemnym (zgodnie ze specyfikacją),
  // niezależnie od preferencji systemowych, o ile użytkownik nie wybrał inaczej.
  return "dark";
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  return { theme, toggleTheme };
}

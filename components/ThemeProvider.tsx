// components/ThemeProvider.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

interface ThemeContextValue {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark"); // default dark

  // apply theme to <html> class and persist
  useEffect(() => {
    // initialize from localStorage if available
    try {
      const saved = localStorage.getItem("flexai_theme") as Theme | null;
      if (saved === "light" || saved === "dark") {
        setThemeState(saved);
      } else {
        setThemeState("dark"); // ensure default
      }
    } catch {
      setThemeState("dark");
    }
  }, []);

  useEffect(() => {
    // update the document class for Tailwind's dark mode (class strategy)
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      // optionally remove a 'light' class if you use it
      root.classList.remove("light");
    } else {
      root.classList.remove("dark");
      root.classList.add("light");
    }

    try {
      localStorage.setItem("flexai_theme", theme);
    } catch {}
  }, [theme]);

  const setTheme = (t: Theme) => setThemeState(t);
  const toggleTheme = () => setThemeState((prev) => (prev === "dark" ? "light" : "dark"));

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used under ThemeProvider");
  return ctx;
}

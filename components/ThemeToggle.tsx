"use client";

import { MoonStar, SunMedium } from "lucide-react";
import { useEffect, useState } from "react";

type Theme = "dark" | "light";

const themeTokens = {
  dark: {
    background: "#06111f",
    foreground: "#eaf2ff",
    muted: "#8ba4c7",
    surface: "#0b1c33",
    surfaceStrong: "#10284a",
    accent: "#4f8cff",
    border: "rgba(255, 255, 255, 0.1)",
    pageGradientStart: "#081423",
    pageGradientMid: "#06111f",
    pageGradientEnd: "#040b14",
    glow: "rgba(79, 140, 255, 0.2)",
  },
  light: {
    background: "#f5f8ff",
    foreground: "#0b1b33",
    muted: "#53657f",
    surface: "#ffffff",
    surfaceStrong: "#e8efff",
    accent: "#2d65ff",
    border: "rgba(11, 27, 51, 0.12)",
    pageGradientStart: "#f8fbff",
    pageGradientMid: "#eef4ff",
    pageGradientEnd: "#dde8ff",
    glow: "rgba(45, 101, 255, 0.16)",
  },
} as const;

function getInitialTheme(): Theme {
  if (typeof window === "undefined") {
    return "dark";
  }

  const storedTheme = window.localStorage.getItem("theme");

  if (storedTheme === "light" || storedTheme === "dark") {
    return storedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  const body = document.body;
  const tokens = themeTokens[theme];
  const bodyBackground = `radial-gradient(circle at top, ${tokens.glow}, transparent 30%), linear-gradient(180deg, ${tokens.pageGradientStart} 0%, ${tokens.pageGradientMid} 55%, ${tokens.pageGradientEnd} 100%)`;

  root.dataset.theme = theme;
  root.style.colorScheme = theme;
  root.style.setProperty("--background", tokens.background);
  root.style.setProperty("--foreground", tokens.foreground);
  root.style.setProperty("--muted", tokens.muted);
  root.style.setProperty("--surface", tokens.surface);
  root.style.setProperty("--surface-strong", tokens.surfaceStrong);
  root.style.setProperty("--accent", tokens.accent);
  root.style.setProperty("--border", tokens.border);
  root.style.setProperty("--page-gradient-start", tokens.pageGradientStart);
  root.style.setProperty("--page-gradient-mid", tokens.pageGradientMid);
  root.style.setProperty("--page-gradient-end", tokens.pageGradientEnd);
  root.style.setProperty("--glow", tokens.glow);

  body.style.backgroundColor = tokens.background;
  body.style.backgroundImage = bodyBackground;
  body.style.color = tokens.foreground;
  window.localStorage.setItem("theme", theme);
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => getInitialTheme());

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface/70 text-foreground transition hover:border-accent/40 hover:bg-accent/10"
    >
      {theme === "dark" ? (
        <MoonStar className="h-5 w-5" strokeWidth={1.75} />
      ) : (
        <SunMedium className="h-5 w-5" strokeWidth={1.75} />
      )}
    </button>
  );
}

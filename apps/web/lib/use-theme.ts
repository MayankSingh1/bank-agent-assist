"use client";

import { useCallback, useSyncExternalStore } from "react";
import { parseTheme, THEME_COOKIE, type Theme } from "./theme";

const DARK_QUERY = "(prefers-color-scheme: dark)";

function current(): Theme {
  return parseTheme(document.documentElement.dataset.theme) ?? (matchMedia(DARK_QUERY).matches ? "dark" : "light");
}

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  const media = matchMedia(DARK_QUERY);
  media.addEventListener("change", onChange);
  return () => {
    observer.disconnect();
    media.removeEventListener("change", onChange);
  };
}

/** The theme in effect, and a setter that saves the choice so the server renders it next time. */
export function useTheme() {
  const resolvedTheme = useSyncExternalStore<Theme>(subscribe, current, () => "light");
  const setTheme = useCallback((theme: Theme) => {
    document.documentElement.dataset.theme = theme;
    document.cookie = `${THEME_COOKIE}=${theme}; path=/; max-age=31536000; samesite=lax`;
  }, []);
  return { resolvedTheme, setTheme };
}

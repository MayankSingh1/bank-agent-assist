export type Theme = "light" | "dark";

/** Cookie holding the agent's explicit theme choice. No cookie means "follow the OS". */
export const THEME_COOKIE = "theme";

export const parseTheme = (value: string | undefined): Theme | undefined =>
  value === "light" || value === "dark" ? value : undefined;

import { createContext, useContext, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import { setTheme, toggleTheme } from "@/store/slices/appSlice";

/**
 * Thin bridge between Redux (source of truth for `theme`) and the DOM: it
 * keeps the `dark` class on <html> in sync so Tailwind's `dark:` variant
 * works, and exposes a small imperative API via context so components don't
 * need to know the state lives in Redux at all.
 */
const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const theme = useSelector((state) => state.app.theme);
  const dispatch = useDispatch();

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.setAttribute("data-theme", theme);
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      setTheme: (next) => dispatch(setTheme(next)),
      toggleTheme: () => dispatch(toggleTheme()),
    }),
    [theme, dispatch],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

export default ThemeContext;

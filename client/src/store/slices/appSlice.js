import { createSlice } from "@reduxjs/toolkit";

import { LOCAL_STORAGE_KEYS } from "@/constants/app";

function getInitialTheme() {
  if (typeof window === "undefined") return "light";
  const stored = window.localStorage.getItem(LOCAL_STORAGE_KEYS.THEME);
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

const initialState = {
  theme: getInitialTheme(),
  isOnline: typeof navigator === "undefined" ? true : navigator.onLine,
  sidebarOpen: false,
};

/**
 * Cross-cutting UI/app state that has nothing to do with a specific
 * business feature — theme, connectivity, chrome visibility. Feature state
 * lives in its own slice under a future `features/<name>/` folder, not here.
 */
const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setTheme(state, action) {
      state.theme = action.payload;
      if (typeof window !== "undefined") {
        window.localStorage.setItem(LOCAL_STORAGE_KEYS.THEME, action.payload);
      }
    },
    toggleTheme(state) {
      state.theme = state.theme === "dark" ? "light" : "dark";
      if (typeof window !== "undefined") {
        window.localStorage.setItem(LOCAL_STORAGE_KEYS.THEME, state.theme);
      }
    },
    setOnlineStatus(state, action) {
      state.isOnline = action.payload;
    },
    setSidebarOpen(state, action) {
      state.sidebarOpen = action.payload;
    },
  },
});

export const { setTheme, toggleTheme, setOnlineStatus, setSidebarOpen } =
  appSlice.actions;
export default appSlice.reducer;

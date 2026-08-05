import { configureStore } from "@reduxjs/toolkit";

import appReducer from "@/store/slices/appSlice";

/**
 * Root Redux store. Feature slices are added to this `reducer` map as each
 * feature under `src/features/<name>/` ships its own slice — `app` is the
 * only reducer that belongs here permanently, since it's cross-cutting
 * rather than feature-owned.
 */
export const store = configureStore({
  reducer: {
    app: appReducer,
  },
  devTools: import.meta.env.DEV,
});

export default store;

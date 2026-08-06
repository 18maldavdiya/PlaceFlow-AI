import { configureStore } from "@reduxjs/toolkit";

import appReducer from "@/store/slices/appSlice";
import authReducer from "@/store/slices/authSlice";

/**
 * Root Redux store. Feature slices are added to this `reducer` map as each
 * feature ships its own slice — `app` (cross-cutting UI state) and `auth`
 * (session state) are the only reducers that belong here permanently;
 * everything else stays scoped to the feature that owns it.
 */
export const store = configureStore({
  reducer: {
    app: appReducer,
    auth: authReducer,
  },
  devTools: import.meta.env.DEV,
});

export default store;

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import * as authService from "@/services/authService";

/**
 * Owns the auth *session* (who's logged in, if anyone) — not the tokens
 * themselves, which live in httpOnly cookies the server sets and this code
 * never touches. `bootstrapped` exists so route guards can tell "we haven't
 * checked yet" apart from "we checked and there's no session", which
 * matters on a hard refresh: without it, ProtectedRoute would redirect to
 * /login for a split second even when a valid cookie session exists.
 */
const initialState = {
  user: null,
  isAuthenticated: false,
  bootstrapped: false,
  status: "idle", // "idle" | "loading" | "succeeded" | "failed"
  error: null,
};

function rejection(error) {
  return {
    message: error?.message || "Something went wrong. Please try again.",
    errors: error?.errors ?? null,
  };
}

export const registerUser = createAsyncThunk(
  "auth/register",
  async (payload, { rejectWithValue }) => {
    try {
      return await authService.register(payload);
    } catch (error) {
      return rejectWithValue(rejection(error));
    }
  },
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (payload, { rejectWithValue }) => {
    try {
      return await authService.login(payload);
    } catch (error) {
      return rejectWithValue(rejection(error));
    }
  },
);

export const logoutUser = createAsyncThunk("auth/logout", async () => {
  try {
    await authService.logout();
  } catch {
    // Best-effort — the client-side session clears either way below.
  }
});

/**
 * Called once on app mount (see App.jsx) to rehydrate the session from the
 * httpOnly cookie. A failure here just means "not logged in", not an error
 * worth surfacing — handled explicitly in the reducer below rather than
 * populating `state.error`.
 */
export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      return await authService.getCurrentUser();
    } catch (error) {
      return rejectWithValue(rejection(error));
    }
  },
);

export const forgotPasswordRequest = createAsyncThunk(
  "auth/forgotPassword",
  async (payload, { rejectWithValue }) => {
    try {
      return await authService.forgotPassword(payload);
    } catch (error) {
      return rejectWithValue(rejection(error));
    }
  },
);

export const resetPasswordRequest = createAsyncThunk(
  "auth/resetPassword",
  async ({ token, ...payload }, { rejectWithValue }) => {
    try {
      return await authService.resetPassword(token, payload);
    } catch (error) {
      return rejectWithValue(rejection(error));
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ---------- register ----------
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        // Registration doesn't log the user in — email verification comes
        // first. Just clear the loading state; the page shows its own
        // success UI from the action payload.
        state.status = "succeeded";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message ?? "Registration failed.";
      })

      // ---------- login ----------
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.bootstrapped = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message ?? "Login failed.";
      })

      // ---------- logout ----------
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.status = "idle";
      })

      // ---------- session bootstrap ----------
      .addCase(fetchCurrentUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.bootstrapped = true;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        // No valid session cookie — not logged in, not an error.
        state.status = "idle";
        state.user = null;
        state.isAuthenticated = false;
        state.bootstrapped = true;
      })

      // ---------- forgot / reset password ----------
      .addCase(forgotPasswordRequest.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(forgotPasswordRequest.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(forgotPasswordRequest.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message ?? "Something went wrong.";
      })
      .addCase(resetPasswordRequest.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(resetPasswordRequest.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(resetPasswordRequest.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message ?? "Something went wrong.";
      });
  },
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;

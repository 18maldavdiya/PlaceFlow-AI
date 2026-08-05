import axios from "axios";

import { env } from "@/config/env";

/**
 * Single Axios instance every service module imports from — never
 * instantiate axios directly elsewhere. `withCredentials` is required
 * because auth uses HTTP-only cookies (access + refresh tokens), not
 * bearer tokens read from JS.
 */
export const api = axios.create({
  baseURL: env.apiBaseUrl,
  withCredentials: true,
  timeout: 15000,
  headers: {
    Accept: "application/json",
  },
});

/**
 * Normalizes every failed response into a consistent shape so calling code
 * (React Query error handlers, form submit handlers) never has to branch on
 * whether `error.response` exists.
 */
function normalizeError(error) {
  if (error.response) {
    const { status, data } = error.response;
    return {
      status,
      message: data?.message || "Something went wrong. Please try again.",
      errors: data?.errors ?? null,
      raw: error,
    };
  }

  if (error.request) {
    return {
      status: 0,
      message: "Unable to reach the server. Check your connection.",
      errors: null,
      raw: error,
    };
  }

  return {
    status: -1,
    message: error.message || "Unexpected error.",
    errors: null,
    raw: error,
  };
}

/**
 * Dispatched on any 401 so a top-level listener (wired once real auth exists)
 * can redirect to sign-in or attempt a silent refresh — kept as a DOM event
 * rather than a direct import so this module never depends on routing/store.
 */
const SESSION_EXPIRED_EVENT = "placeflow:session-expired";

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const normalized = normalizeError(error);

    if (normalized.status === 401 && typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent(SESSION_EXPIRED_EVENT));
    }

    return Promise.reject(normalized);
  },
);

export { SESSION_EXPIRED_EVENT };
export default api;

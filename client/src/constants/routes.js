/**
 * Central registry of route paths. Import these instead of hardcoding
 * strings in <Link>/navigate() calls or in routes/AppRouter.jsx, so a path
 * only ever changes in one place.
 *
 * Structural routes (home, not-found), the authentication foundation, and
 * the Student Dashboard. Recruiter/TPO/Admin dashboard routes are added
 * here once those modules land, not before.
 */
export const ROUTES = Object.freeze({
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password/:token",
  VERIFY_EMAIL: "/verify-email/:token",
  INVALID_LINK: "/invalid-link",
  STUDENT_DASHBOARD: "/dashboard",
  PROFILE: "/profile",
  NOT_FOUND: "*",
});

/**
 * Builds a concrete path from a `:token`-style route pattern — e.g.
 * `buildRoute(ROUTES.RESET_PASSWORD, { token })` — so call sites never
 * hand-concatenate route strings.
 */
export function buildRoute(pattern, params = {}) {
  return Object.entries(params).reduce(
    (path, [key, value]) => path.replace(`:${key}`, encodeURIComponent(value)),
    pattern,
  );
}

export default ROUTES;

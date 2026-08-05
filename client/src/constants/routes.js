/**
 * Central registry of route paths. Import these instead of hardcoding
 * strings in <Link>/navigate() calls or in routes/AppRouter.jsx, so a path
 * only ever changes in one place.
 *
 * Only structural routes exist at this stage (home + not-found). Feature
 * routes (auth, dashboards, drives, etc.) are added here as each feature
 * lands, not before.
 */
export const ROUTES = Object.freeze({
  HOME: "/",
  NOT_FOUND: "*",
});

export default ROUTES;

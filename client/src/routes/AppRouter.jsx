import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { RootLayout } from "@/layouts/RootLayout";
import { HomePage } from "@/pages/Home/HomePage";
import { NotFoundPage } from "@/pages/NotFound/NotFoundPage";
import { ROUTES } from "@/constants/routes";

/**
 * Central route tree. Feature routes are added as children of RootLayout
 * (or a feature-specific layout nested under it) as each feature ships —
 * only structural routes exist here at initialization time. Route guards
 * (e.g. requireAuth, requireRole) will wrap `element` on protected routes
 * once auth exists; none are needed yet.
 */
const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: ROUTES.NOT_FOUND, element: <NotFoundPage /> },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}

export default AppRouter;

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { AuthLayout } from "@/layouts/AuthLayout";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { RootLayout } from "@/layouts/RootLayout";
import { DashboardPage } from "@/pages/Dashboard/DashboardPage";
import { ForgotPasswordPage } from "@/pages/ForgotPassword/ForgotPasswordPage";
import { HomePage } from "@/pages/Home/HomePage";
import { InvalidLinkPage } from "@/pages/InvalidLink/InvalidLinkPage";
import { LoginPage } from "@/pages/Login/LoginPage";
import { NotFoundPage } from "@/pages/NotFound/NotFoundPage";
import { ProfilePage } from "@/pages/Profile/ProfilePage";
import { RegisterPage } from "@/pages/Register/RegisterPage";
import { ResetPasswordPage } from "@/pages/ResetPassword/ResetPasswordPage";
import { VerifyEmailPage } from "@/pages/VerifyEmail/VerifyEmailPage";
import { ROLES } from "@/constants/app";
import { ROUTES } from "@/constants/routes";
import { RequireRole } from "@/routes/ProtectedRoute";

/**
 * Central route tree. The Landing Page branch (RootLayout + Home/NotFound)
 * and the Authentication branch (AuthLayout + its six pages) are locked —
 * do not modify either here. The Student Dashboard branch is also locked;
 * the Student Profile page (Phase 5.2A) is added as a sibling route inside
 * it, reusing the same unmodified DashboardLayout (Sidebar + TopNavbar) and
 * the same `RequireRole` guard — unauthenticated visitors are sent to
 * /login, and any non-student role is redirected home. Recruiter/TPO/Admin
 * dashboard branches will follow the same overall pattern once those
 * modules exist.
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
  {
    element: <AuthLayout />,
    children: [
      { path: ROUTES.LOGIN, element: <LoginPage /> },
      { path: ROUTES.REGISTER, element: <RegisterPage /> },
      { path: ROUTES.FORGOT_PASSWORD, element: <ForgotPasswordPage /> },
      { path: ROUTES.RESET_PASSWORD, element: <ResetPasswordPage /> },
      { path: ROUTES.VERIFY_EMAIL, element: <VerifyEmailPage /> },
      { path: ROUTES.INVALID_LINK, element: <InvalidLinkPage /> },
    ],
  },
  {
    element: <RequireRole roles={[ROLES.STUDENT]} />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: ROUTES.STUDENT_DASHBOARD, element: <DashboardPage /> },
          { path: ROUTES.PROFILE, element: <ProfilePage /> },
        ],
      },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}

export default AppRouter;

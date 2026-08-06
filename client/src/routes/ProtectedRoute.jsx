import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

import { Spinner } from "@/components/common/Spinner";
import { ROUTES } from "@/constants/routes";

function BootstrapGate() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Spinner size={28} />
    </div>
  );
}

/**
 * Route guards for the router tree — not yet applied to any route, since no
 * dashboard/module pages exist in this phase. Once they do, wrap their
 * branch like:
 *
 *   { element: <RequireAuth />, children: [{ path: "/dashboard", ... }] }
 *   { element: <RequireRole roles={["tpo", "admin"]} />, children: [...] }
 *
 * Both wait for `state.auth.bootstrapped` before deciding — otherwise a
 * hard refresh would redirect to /login for a frame even when a valid
 * session cookie is about to be confirmed by GET /auth/me.
 */
export function RequireAuth() {
  const { isAuthenticated, bootstrapped } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!bootstrapped) return <BootstrapGate />;

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  return <Outlet />;
}

export function RequireRole({ roles }) {
  const { user, isAuthenticated, bootstrapped } = useSelector(
    (state) => state.auth,
  );
  const location = useLocation();

  if (!bootstrapped) return <BootstrapGate />;

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  if (!roles.includes(user?.role)) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return <Outlet />;
}

export default RequireAuth;

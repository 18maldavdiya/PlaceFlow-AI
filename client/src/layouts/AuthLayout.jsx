import { Outlet, Link } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import { Button } from "@/components/common/Button";
import { GradientOrbs } from "@/components/landing/GradientOrbs";
import { APP_NAME } from "@/constants/app";
import { ROUTES } from "@/constants/routes";
import { toggleTheme } from "@/store/slices/appSlice";

/**
 * Shell for every authentication page — deliberately minimal compared to
 * RootLayout's full marketing chrome (no seven-item nav, no Login/Register
 * buttons pointing at the page you're already on). Just a logo back to the
 * marketing site, a theme toggle, and centered routed content.
 */
export function AuthLayout() {
  const theme = useSelector((state) => state.app.theme);
  const dispatch = useDispatch();

  return (
    <div className="bg-grid relative flex min-h-screen flex-col overflow-hidden bg-background text-foreground">
      <GradientOrbs />

      <header className="container relative flex h-16 items-center justify-between md:h-20">
        <Link to={ROUTES.HOME} className="flex items-center gap-2.5">
          <img src="/favicon.svg" alt="" className="h-8 w-8 rounded-lg" />
          <span className="text-lg font-semibold tracking-tight">
            {APP_NAME.replace(/\s*AI$/, "")}
            <span className="gradient-text"> AI</span>
          </span>
        </Link>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => dispatch(toggleTheme())}
          aria-label={
            theme === "dark" ? "Switch to light theme" : "Switch to dark theme"
          }
        >
          {theme === "dark" ? (
            <Sun className="h-4 w-4" aria-hidden />
          ) : (
            <Moon className="h-4 w-4" aria-hidden />
          )}
        </Button>
      </header>

      <main className="relative flex flex-1 items-center justify-center px-4 py-10 sm:px-6">
        <Outlet />
      </main>

      <footer className="container relative py-6 text-center text-xs text-muted">
        &copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.
      </footer>
    </div>
  );
}

export default AuthLayout;

import { Moon, Sun, WifiOff } from "lucide-react";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

import { Button } from "@/components/common/Button";
import { useTheme } from "@/context/ThemeContext";
import { APP_NAME } from "@/constants/app";

/**
 * Root page shell: header, routed content via <Outlet/>, footer. Every
 * route rendered through routes/AppRouter.jsx mounts inside this layout.
 * Feature-specific layouts (e.g. a dashboard sidebar) will wrap this one
 * rather than replace it, once they exist.
 */
export function RootLayout() {
  const { theme, toggleTheme } = useTheme();
  const isOnline = useSelector((state) => state.app.isOnline);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="border-b border-border">
        <div className="container flex h-16 items-center justify-between">
          <span className="text-base font-semibold tracking-tight">
            {APP_NAME}
          </span>

          <div className="flex items-center gap-3">
            {!isOnline && (
              <span className="flex items-center gap-1.5 text-xs text-warning">
                <WifiOff className="h-4 w-4" aria-hidden />
                Offline
              </span>
            )}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              aria-label={
                theme === "dark"
                  ? "Switch to light theme"
                  : "Switch to dark theme"
              }
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" aria-hidden />
              ) : (
                <Moon className="h-4 w-4" aria-hidden />
              )}
            </Button>
          </div>
        </div>
      </header>

      <main className="container flex-1 py-10">
        <Outlet />
      </main>

      <footer className="border-t border-border py-6">
        <div className="container text-xs text-muted">
          {APP_NAME} — Multi-College Placement &amp; Career Management
          Platform
        </div>
      </footer>
    </div>
  );
}

export default RootLayout;

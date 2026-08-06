import { useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import { LayoutDashboard, Menu, Moon, Sun, WifiOff, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { Button } from "@/components/common/Button";
import { APP_NAME } from "@/constants/app";
import { NAV_LINKS } from "@/constants/landing";
import { ROUTES } from "@/constants/routes";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { toggleTheme } from "@/store/slices/appSlice";
import { cn } from "@/utils/cn";

const SECTION_IDS = NAV_LINKS.map((link) => link.href.replace("#", ""));

/**
 * Sticky, glassmorphic site header. Scroll-spies the page's section ids to
 * animate an underline under the current nav link, and collapses into a
 * slide-down panel on small screens.
 */
export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const theme = useSelector((state) => state.app.theme);
  const isOnline = useSelector((state) => state.app.isOnline);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  const activeId = useScrollSpy(SECTION_IDS);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 16);
  });

  const logoContent = (
    <>
      <img src="/favicon.svg" alt="" className="h-8 w-8 rounded-lg" />
      <span className="text-lg font-semibold tracking-tight">
        {APP_NAME.replace(/\s*AI$/, "")}
        <span className="gradient-text"> AI</span>
      </span>
    </>
  );

  return (
    <header
      className={cn(
        "glass sticky top-0 z-50 border-b transition-shadow duration-300",
        scrolled
          ? "border-border shadow-lg shadow-black/[0.03] dark:shadow-black/20"
          : "border-transparent shadow-none",
      )}
    >
      <div className="container flex h-16 items-center justify-between md:h-20">
        {isAuthenticated ? (
          <Link
            to={ROUTES.STUDENT_DASHBOARD}
            className="flex items-center gap-2.5"
            onClick={() => setMobileOpen(false)}
          >
            {logoContent}
          </Link>
        ) : (
          <a
            href="#hero"
            className="flex items-center gap-2.5"
            onClick={() => setMobileOpen(false)}
          >
            {logoContent}
          </a>
        )}

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => {
            const id = link.href.replace("#", "");
            const isActive = activeId === id;
            return (
              <a
                key={link.href}
                href={link.href}
                className={cn(
                  "relative px-3.5 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "text-foreground"
                    : "text-muted hover:text-foreground",
                )}
              >
                {link.label}
                {isActive && (
                  <motion.span
                    layoutId="navbar-active-indicator"
                    className="absolute inset-x-3 -bottom-px h-px bg-primary"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </a>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {!isOnline && (
            <span className="flex items-center gap-1.5 text-xs text-warning">
              <WifiOff className="h-3.5 w-3.5" aria-hidden />
              Offline
            </span>
          )}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => dispatch(toggleTheme())}
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
          {isAuthenticated ? (
            <Button
              as={Link}
              to={ROUTES.STUDENT_DASHBOARD}
              variant="gradient"
              size="sm"
            >
              <LayoutDashboard className="h-4 w-4" aria-hidden />
              Dashboard
            </Button>
          ) : (
            <>
              <Button as={Link} to={ROUTES.LOGIN} variant="ghost" size="sm">
                Log in
              </Button>
              <Button
                as={Link}
                to={ROUTES.REGISTER}
                variant="gradient"
                size="sm"
              >
                Register
              </Button>
            </>
          )}
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-foreground lg:hidden"
          onClick={() => setMobileOpen((open) => !open)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? (
            <X className="h-6 w-6" aria-hidden />
          ) : (
            <Menu className="h-6 w-6" aria-hidden />
          )}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="glass overflow-hidden border-t border-border lg:hidden"
            aria-label="Mobile"
          >
            <div className="container flex flex-col gap-1 py-4">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-surface"
                >
                  {link.label}
                </a>
              ))}
              <div className="mt-2 flex items-center gap-2 border-t border-border pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => dispatch(toggleTheme())}
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
                {isAuthenticated ? (
                  <Button
                    as={Link}
                    to={ROUTES.STUDENT_DASHBOARD}
                    variant="gradient"
                    size="sm"
                    className="flex-1"
                    onClick={() => setMobileOpen(false)}
                  >
                    <LayoutDashboard className="h-4 w-4" aria-hidden />
                    Dashboard
                  </Button>
                ) : (
                  <>
                    <Button
                      as={Link}
                      to={ROUTES.LOGIN}
                      variant="secondary"
                      size="sm"
                      className="flex-1"
                      onClick={() => setMobileOpen(false)}
                    >
                      Log in
                    </Button>
                    <Button
                      as={Link}
                      to={ROUTES.REGISTER}
                      variant="gradient"
                      size="sm"
                      className="flex-1"
                      onClick={() => setMobileOpen(false)}
                    >
                      Register
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Navbar;

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { APP_NAME } from "@/constants/app";
import { LOGOUT_LINK, SIDEBAR_LINKS } from "@/constants/dashboard";
import { ROUTES } from "@/constants/routes";
import { logoutUser } from "@/store/slices/authSlice";
import { cn } from "@/utils/cn";

function comingSoon(label) {
  toast(`${label} isn't built yet — Dashboard Home comes first.`, {
    icon: "🚧",
  });
}

function SidebarContent({ onNavigate }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function handleLogout() {
    await dispatch(logoutUser());
    toast.success("Logged out successfully.");
    navigate(ROUTES.HOME);
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-2.5 px-5 md:h-20">
        <img src="/favicon.svg" alt="" className="h-8 w-8 rounded-lg" />
        <span className="text-lg font-semibold tracking-tight">
          {APP_NAME.replace(/\s*AI$/, "")}
          <span className="gradient-text"> AI</span>
        </span>
      </div>

      <nav
        className="flex-1 space-y-1 overflow-y-auto px-3 py-4"
        aria-label="Dashboard"
      >
        {SIDEBAR_LINKS.map((link) =>
          link.comingSoon ? (
            <button
              key={link.label}
              type="button"
              onClick={() => comingSoon(link.label)}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-muted transition-colors hover:bg-surface hover:text-foreground"
            >
              <link.icon className="h-4 w-4 shrink-0" aria-hidden />
              {link.label}
            </button>
          ) : (
            <NavLink
              key={link.label}
              to={link.path}
              end
              onClick={onNavigate}
              className={({ isActive }) =>
                cn(
                  "relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted hover:bg-surface hover:text-foreground",
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.span
                      layoutId="sidebar-active-indicator"
                      className="absolute inset-y-1 left-0 w-0.5 rounded-full bg-primary"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                  <link.icon className="h-4 w-4 shrink-0" aria-hidden />
                  {link.label}
                </>
              )}
            </NavLink>
          ),
        )}
      </nav>

      <div className="border-t border-border p-3">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-danger transition-colors hover:bg-danger/10"
        >
          <LOGOUT_LINK.icon className="h-4 w-4 shrink-0" aria-hidden />
          {LOGOUT_LINK.label}
        </button>
      </div>
    </div>
  );
}

/**
 * Desktop: a permanent left column. Mobile: a slide-in drawer over a
 * backdrop, controlled by `mobileOpen`/`onClose` from DashboardLayout (the
 * hamburger trigger lives in TopNavbar).
 */
export function Sidebar({ mobileOpen, onClose }) {
  return (
    <>
      <aside className="glass hidden w-64 shrink-0 border-r border-border lg:block">
        <SidebarContent />
      </aside>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              aria-hidden
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.25, ease: "easeInOut" }}
              className="glass fixed inset-y-0 left-0 z-50 w-72 border-r border-border lg:hidden"
            >
              <button
                type="button"
                onClick={onClose}
                aria-label="Close menu"
                className="absolute right-3 top-4 flex h-9 w-9 items-center justify-center rounded-lg text-muted hover:bg-surface hover:text-foreground"
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
              <SidebarContent onNavigate={onClose} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default Sidebar;

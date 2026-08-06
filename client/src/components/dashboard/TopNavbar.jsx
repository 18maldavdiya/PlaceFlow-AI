import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, Menu, Moon, Search, Sun } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import { DASHBOARD_QUERY_KEYS } from "@/constants/dashboard";
import { getNotifications } from "@/services/dashboardService";
import { toggleTheme } from "@/store/slices/appSlice";
import { formatDateTime } from "@/utils/formatDate";

function initialsOf(fullName = "") {
  return fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function TopNavbar({ onOpenSidebar }) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const theme = useSelector((state) => state.app.theme);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const { data: notifications = [] } = useQuery({
    queryKey: [DASHBOARD_QUERY_KEYS.NOTIFICATIONS],
    queryFn: () => getNotifications(5),
  });
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <header className="glass sticky top-0 z-30 border-b border-border">
      <div className="flex h-16 items-center justify-between gap-4 px-4 md:h-20 md:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onOpenSidebar}
            aria-label="Open menu"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-foreground lg:hidden"
          >
            <Menu className="h-5 w-5" aria-hidden />
          </button>
          <p className="truncate text-sm font-medium text-foreground sm:text-base">
            Welcome back, {user?.fullName?.split(" ")[0] ?? "there"}
          </p>
        </div>

        <div className="relative hidden max-w-sm flex-1 md:block">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
            aria-hidden
          />
          <input
            type="search"
            placeholder="Search jobs, companies..."
            className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <div className="relative">
            <button
              type="button"
              onClick={() => setNotificationsOpen((open) => !open)}
              aria-label="Notifications"
              aria-expanded={notificationsOpen}
              className="relative flex h-10 w-10 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface hover:text-foreground"
            >
              <Bell className="h-4 w-4" aria-hidden />
              {unreadCount > 0 && (
                <span className="absolute right-1.5 top-1.5 flex h-2 w-2 rounded-full bg-danger" />
              )}
            </button>

            <AnimatePresence>
              {notificationsOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setNotificationsOpen(false)}
                    aria-hidden
                  />
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="glass absolute right-0 z-20 mt-2 w-80 rounded-xl border border-border p-2 shadow-2xl"
                  >
                    <p className="px-2.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted">
                      Notifications
                    </p>
                    {notifications.length === 0 ? (
                      <p className="px-2.5 py-4 text-center text-sm text-muted">
                        You&rsquo;re all caught up.
                      </p>
                    ) : (
                      <ul className="max-h-72 space-y-0.5 overflow-y-auto">
                        {notifications.map((notification) => (
                          <li
                            key={notification.id}
                            className="rounded-lg px-2.5 py-2 hover:bg-surface"
                          >
                            <p className="text-xs leading-relaxed text-foreground">
                              {notification.message}
                            </p>
                            <p className="mt-1 text-[11px] text-muted">
                              {formatDateTime(notification.createdAt)}
                            </p>
                          </li>
                        ))}
                      </ul>
                    )}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          <button
            type="button"
            onClick={() => dispatch(toggleTheme())}
            aria-label={
              theme === "dark"
                ? "Switch to light theme"
                : "Switch to dark theme"
            }
            className="flex h-10 w-10 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface hover:text-foreground"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" aria-hidden />
            ) : (
              <Moon className="h-4 w-4" aria-hidden />
            )}
          </button>

          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
            style={{ background: "var(--gradient-brand)" }}
            aria-label={user?.fullName ?? "Profile"}
          >
            {initialsOf(user?.fullName)}
          </span>
        </div>
      </div>
    </header>
  );
}

export default TopNavbar;

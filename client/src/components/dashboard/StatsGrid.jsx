import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Bookmark, Briefcase, CalendarClock, Trophy } from "lucide-react";

import { AnimatedCounter } from "@/components/common/AnimatedCounter";
import { Skeleton } from "@/components/common/Skeleton";
import { DASHBOARD_QUERY_KEYS } from "@/constants/dashboard";
import { getSummary } from "@/services/dashboardService";

const STAT_CARDS = [
  { key: "applications", label: "Applications", icon: Briefcase },
  { key: "interviews", label: "Interviews", icon: CalendarClock },
  { key: "offers", label: "Offers", icon: Trophy },
  { key: "savedJobs", label: "Saved Jobs", icon: Bookmark },
];

/**
 * Shares the "dashboard-summary" query with WelcomeCard — the backend's
 * single /dashboard/summary endpoint already returns `stats` alongside
 * `profile`, and React Query dedupes the two components' identical
 * queryKey into one request.
 */
export function StatsGrid() {
  const { data, isLoading } = useQuery({
    queryKey: [DASHBOARD_QUERY_KEYS.SUMMARY],
    queryFn: getSummary,
  });

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {STAT_CARDS.map((stat, index) => (
        <motion.div
          key={stat.key}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{
            duration: 0.4,
            delay: index * 0.06,
            ease: [0.16, 1, 0.3, 1],
          }}
          whileHover={{ y: -4 }}
          className="rounded-2xl border border-border bg-surface p-5 shadow-sm transition-shadow duration-300 hover:shadow-lg hover:shadow-primary/5"
        >
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <stat.icon className="h-5 w-5" aria-hidden />
          </span>
          {isLoading ? (
            <Skeleton className="mt-4 h-8 w-14" />
          ) : (
            <AnimatedCounter
              value={data?.stats?.[stat.key] ?? 0}
              className="mt-4 block text-2xl font-semibold tabular-nums tracking-tight text-foreground"
            />
          )}
          <p className="mt-1 text-xs text-muted">{stat.label}</p>
        </motion.div>
      ))}
    </div>
  );
}

export default StatsGrid;

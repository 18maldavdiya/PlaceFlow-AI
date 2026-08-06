import { motion } from "framer-motion";

import { cn } from "@/utils/cn";

/**
 * Shared card chrome for every Dashboard Home section — one place for the
 * glass/border/radius treatment and the fade-up entrance instead of seven
 * copies of it.
 */
export function DashboardCard({ title, action, className, children }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-6",
        className,
      )}
    >
      {(title || action) && (
        <div className="mb-4 flex items-center justify-between gap-3">
          {title && (
            <h2 className="text-base font-semibold text-foreground">{title}</h2>
          )}
          {action}
        </div>
      )}
      {children}
    </motion.section>
  );
}

export default DashboardCard;

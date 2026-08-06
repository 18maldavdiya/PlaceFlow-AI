import { motion } from "framer-motion";

import { cn } from "@/utils/cn";

/**
 * Shared glass card shell for every auth page (login, register, forgot/
 * reset password, verify email, invalid link) — one place for the
 * animated-entrance + glassmorphism treatment instead of six copies of it.
 */
export function AuthCard({ icon: Icon, title, subtitle, className, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "glass w-full rounded-2xl border border-border p-7 shadow-2xl shadow-black/10 dark:shadow-black/40 sm:p-9",
        className,
      )}
    >
      {(Icon || title) && (
        <div className="mb-7 text-center">
          {Icon && (
            <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icon className="h-6 w-6" aria-hidden />
            </span>
          )}
          {title && (
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              {title}
            </h1>
          )}
          {subtitle && <p className="mt-1.5 text-sm text-muted">{subtitle}</p>}
        </div>
      )}
      {children}
    </motion.div>
  );
}

export default AuthCard;

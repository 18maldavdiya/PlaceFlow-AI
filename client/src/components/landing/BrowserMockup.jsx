import { Lock } from "lucide-react";

import { cn } from "@/utils/cn";

/**
 * Reusable "browser window" chrome wrapping a dashboard preview — used by
 * the hero, recruiter, and college sections so every product screenshot
 * mock reads as one consistent, premium artifact instead of three
 * differently-styled panels.
 */
export function BrowserMockup({
  label = "app.placeflow.ai",
  className,
  children,
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl shadow-black/10 dark:shadow-black/40",
        className,
      )}
    >
      <div className="flex items-center gap-3 border-b border-border bg-background/60 px-4 py-3">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-danger/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-warning/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-success/70" />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="flex items-center gap-1.5 rounded-md bg-surface px-3 py-1 text-xs text-muted">
            <Lock className="h-3 w-3" aria-hidden />
            {label}
          </div>
        </div>
      </div>
      <div className="bg-background">{children}</div>
    </div>
  );
}

export default BrowserMockup;

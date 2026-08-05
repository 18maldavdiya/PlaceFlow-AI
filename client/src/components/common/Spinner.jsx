import { Loader2 } from "lucide-react";

import { cn } from "@/utils/cn";

/**
 * Standard loading indicator. Use for inline/section loading states;
 * full-page loading should still wrap this rather than inventing a new mark.
 */
export function Spinner({ className, size = 24, label = "Loading" }) {
  return (
    <span
      role="status"
      aria-label={label}
      className={cn("inline-flex items-center justify-center", className)}
    >
      <Loader2
        width={size}
        height={size}
        className="animate-spin text-muted"
        aria-hidden
      />
      <span className="sr-only">{label}</span>
    </span>
  );
}

export default Spinner;

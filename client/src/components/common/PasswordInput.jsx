import { forwardRef, useId, useState } from "react";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";

import { cn } from "@/utils/cn";

/**
 * Same floating-label treatment as FormInput, plus a show/hide toggle.
 * Kept as its own component rather than a `type` prop on FormInput since
 * the toggle button needs to sit inside the same relative container as the
 * input, and that markup doesn't apply to any other field type.
 */
export const PasswordInput = forwardRef(function PasswordInput(
  { label, error, className, id, ...props },
  ref,
) {
  const [visible, setVisible] = useState(false);
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div className={className}>
      <div className="relative">
        <input
          ref={ref}
          id={inputId}
          type={visible ? "text" : "password"}
          placeholder=" "
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={cn(
            "peer w-full rounded-lg border bg-background px-3.5 pb-2 pr-11 pt-4 text-sm text-foreground placeholder-transparent transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-primary/30",
            error
              ? "border-danger focus:border-danger"
              : "border-border focus:border-primary",
          )}
          {...props}
        />
        <label
          htmlFor={inputId}
          className={cn(
            "pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-muted transition-all duration-150",
            "peer-focus:top-3 peer-focus:-translate-y-1/2 peer-focus:text-[11px] peer-focus:text-primary",
            "peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:-translate-y-1/2 peer-[:not(:placeholder-shown)]:text-[11px]",
            error && "peer-focus:text-danger",
          )}
        >
          {label}
        </label>
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted transition-colors hover:text-foreground"
          aria-label={visible ? "Hide password" : "Show password"}
          tabIndex={-1}
        >
          {visible ? (
            <EyeOff className="h-4 w-4" aria-hidden />
          ) : (
            <Eye className="h-4 w-4" aria-hidden />
          )}
        </button>
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          id={`${inputId}-error`}
          role="alert"
          className="mt-1.5 flex items-center gap-1.5 text-xs text-danger"
        >
          <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden />
          {error}
        </motion.p>
      )}
    </div>
  );
});

export default PasswordInput;

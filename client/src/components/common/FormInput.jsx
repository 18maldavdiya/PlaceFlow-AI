import { forwardRef, useId } from "react";
import { AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

import { cn } from "@/utils/cn";

/**
 * Floating-label text input for the auth forms (and any future form that
 * wants the same treatment). Built as an uncontrolled input so it plugs
 * directly into React Hook Form via `{...register("field")}` — the ref
 * forward is what lets RHF call `.focus()` on the first invalid field.
 *
 * The floating label itself is pure CSS (`peer` + `:placeholder-shown`),
 * not JS state — it never fights the browser's autofill styling and never
 * re-renders on keystroke.
 */
export const FormInput = forwardRef(function FormInput(
  { label, type = "text", error, className, id, ...props },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div className={className}>
      <div className="relative">
        <input
          ref={ref}
          id={inputId}
          type={type}
          placeholder=" "
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={cn(
            "peer w-full rounded-lg border bg-background px-3.5 pb-2 pt-4 text-sm text-foreground placeholder-transparent transition-colors",
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

export default FormInput;

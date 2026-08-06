import { forwardRef, useId } from "react";
import { AlertCircle, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

import { cn } from "@/utils/cn";

/**
 * Labeled select for the profile forms — same border/focus/error language
 * as FormInput, but with a static label above rather than a floating one:
 * `:placeholder-shown` doesn't apply to <select>, so faking a floating
 * label on it tends to look broken on first paint. This is the honest
 * alternative most design systems settle on for selects.
 */
export const SelectInput = forwardRef(function SelectInput(
  { label, options, placeholder = "Select...", error, className, id, ...props },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div className={className}>
      <label
        htmlFor={inputId}
        className="mb-1.5 block text-xs font-medium text-muted"
      >
        {label}
      </label>
      <div className="relative">
        <select
          ref={ref}
          id={inputId}
          defaultValue=""
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={cn(
            "w-full appearance-none rounded-lg border bg-background px-3.5 py-2.5 pr-9 text-sm text-foreground transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-primary/30",
            error
              ? "border-danger focus:border-danger"
              : "border-border focus:border-primary",
          )}
          {...props}
        >
          <option value="" disabled hidden>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
          aria-hidden
        />
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

export default SelectInput;

import { forwardRef } from "react";
import { Loader2 } from "lucide-react";

import { cn } from "@/utils/cn";

const VARIANTS = {
  primary:
    "bg-primary text-primary-foreground hover:opacity-90 focus-visible:ring-primary",
  secondary:
    "bg-surface text-foreground border border-border hover:bg-background focus-visible:ring-primary",
  ghost:
    "bg-transparent text-foreground hover:bg-surface focus-visible:ring-primary",
  danger: "bg-danger text-white hover:opacity-90 focus-visible:ring-danger",
};

const SIZES = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
};

/**
 * Base button used across the app. Feature-specific buttons should compose
 * this rather than styling a raw <button> — keeps focus states, disabled
 * states, and loading states consistent everywhere.
 */
export const Button = forwardRef(function Button(
  {
    as: Component = "button",
    variant = "primary",
    size = "md",
    isLoading = false,
    disabled = false,
    className,
    children,
    type,
    ...props
  },
  ref,
) {
  // Only a real <button> takes `type`/`disabled` — an <a> or <Link> rendered
  // via `as` gets neither, since HTML doesn't define them for anchors.
  const nativeButtonProps =
    Component === "button"
      ? { type: type || "button", disabled: disabled || isLoading }
      : {};

  return (
    <Component
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "disabled:cursor-not-allowed disabled:opacity-50",
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      aria-busy={isLoading}
      {...nativeButtonProps}
      {...props}
    >
      {isLoading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
      {children}
    </Component>
  );
});

export default Button;

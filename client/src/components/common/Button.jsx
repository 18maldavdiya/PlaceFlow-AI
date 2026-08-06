import { forwardRef, useState } from "react";
import { Loader2 } from "lucide-react";

import { cn } from "@/utils/cn";

const VARIANTS = {
  primary:
    "bg-primary text-primary-foreground hover:opacity-90 focus-visible:ring-primary",
  gradient:
    "text-white shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 focus-visible:ring-primary [background-image:var(--gradient-brand)] hover:brightness-110",
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
  xl: "h-14 px-8 text-base",
};

/**
 * Base button used across the app. Feature-specific buttons should compose
 * this rather than styling a raw <button> — keeps focus states, disabled
 * states, loading states, and the ripple/press feedback consistent
 * everywhere. `ripple` defaults on for the two CTA-style variants and off
 * for the quieter ones, where a ripple would read as noisy.
 */
export const Button = forwardRef(function Button(
  {
    as: Component = "button",
    variant = "primary",
    size = "md",
    isLoading = false,
    disabled = false,
    ripple,
    className,
    children,
    type,
    onPointerDown,
    ...props
  },
  ref,
) {
  const [ripples, setRipples] = useState([]);
  const rippleEnabled =
    ripple ?? (variant === "primary" || variant === "gradient");

  // Only a real <button> takes `type`/`disabled` — an <a> or <Link> rendered
  // via `as` gets neither, since HTML doesn't define them for anchors.
  const nativeButtonProps =
    Component === "button"
      ? { type: type || "button", disabled: disabled || isLoading }
      : {};

  function handlePointerDown(event) {
    if (rippleEnabled && !disabled && !isLoading) {
      const rect = event.currentTarget.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const id = Date.now();
      setRipples((current) => [
        ...current,
        {
          id,
          size,
          x: event.clientX - rect.left - size / 2,
          y: event.clientY - rect.top - size / 2,
        },
      ]);
      setTimeout(() => {
        setRipples((current) => current.filter((r) => r.id !== id));
      }, 650);
    }
    onPointerDown?.(event);
  }

  return (
    <Component
      ref={ref}
      className={cn(
        "relative isolate inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl font-medium transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "disabled:cursor-not-allowed disabled:opacity-50",
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      aria-busy={isLoading}
      onPointerDown={handlePointerDown}
      {...nativeButtonProps}
      {...props}
    >
      {isLoading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
      {children}
      {rippleEnabled && (
        <span className="pointer-events-none absolute inset-0 -z-[1] overflow-hidden rounded-[inherit]">
          {ripples.map((r) => (
            <span
              key={r.id}
              className="animate-ripple absolute rounded-full bg-white/40"
              style={{
                width: r.size,
                height: r.size,
                left: r.x,
                top: r.y,
              }}
            />
          ))}
        </span>
      )}
    </Component>
  );
});

export default Button;

import { motion, useReducedMotion } from "framer-motion";

import { cn } from "@/utils/cn";

/**
 * Animated circular progress ring — the "Placement Readiness %" (Welcome
 * Card) and "Profile Completion" (Profile Completion Card) both use this
 * rather than duplicating the SVG math twice.
 */
export function ProgressRing({
  value,
  size = 96,
  strokeWidth = 8,
  label,
  className,
  trackClassName = "text-border",
  progressClassName = "text-primary",
}) {
  const shouldReduceMotion = useReducedMotion();
  const clamped = Math.max(0, Math.min(100, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center",
        className,
      )}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
          className={trackClassName}
          stroke="currentColor"
          opacity={0.35}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
          className={progressClassName}
          stroke="currentColor"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { duration: 1.1, ease: [0.16, 1, 0.3, 1] }
          }
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {label ?? (
          <span className="text-lg font-semibold text-foreground">
            {Math.round(clamped)}%
          </span>
        )}
      </div>
    </div>
  );
}

export default ProgressRing;

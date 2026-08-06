import { cn } from "@/utils/cn";

/**
 * Loading placeholder built on the `.animate-shimmer` utility already
 * defined in styles/animations.css. Every dashboard card renders one of
 * these (via its own `*Skeleton` variant) while its query is loading,
 * instead of popping in empty and re-laying-out once data arrives.
 */
export function Skeleton({ className }) {
  return (
    <div aria-hidden className={cn("animate-shimmer rounded-lg", className)} />
  );
}

export default Skeleton;

import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge conditional class names and resolve conflicting Tailwind utility
 * classes (e.g. "p-2" vs "p-4") in favor of the one that appears last.
 * Standard helper used by every component instead of raw template strings.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default cn;

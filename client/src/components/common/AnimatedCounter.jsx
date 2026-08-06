import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";

/**
 * Counts up from 0 to `value` once it scrolls into view, then holds —
 * used by the landing page's stats strip. Runs on Framer Motion's
 * imperative `animate()` rather than re-rendering on every tick via
 * `setInterval`, so it stays smooth even for four counters running at once.
 */
export function AnimatedCounter({
  value,
  prefix = "",
  suffix = "",
  duration = 1.8,
  className,
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView) return undefined;

    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    });

    return () => controls.stop();
  }, [isInView, value, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}

export default AnimatedCounter;

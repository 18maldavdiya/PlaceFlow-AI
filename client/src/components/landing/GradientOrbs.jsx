import { motion, useReducedMotion } from "framer-motion";

/**
 * Decorative, blurred gradient blobs used behind the hero section. Purely
 * ambient — marked aria-hidden, and the slow float animation is skipped
 * entirely for users who prefer reduced motion rather than just slowed down.
 */
export function GradientOrbs() {
  const shouldReduceMotion = useReducedMotion();

  const float = (delay) =>
    shouldReduceMotion
      ? {}
      : {
          animate: {
            y: [0, -24, 0],
            x: [0, 16, 0],
          },
          transition: {
            duration: 14,
            delay,
            repeat: Infinity,
            ease: "easeInOut",
          },
        };

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <motion.div
        {...float(0)}
        className="absolute -left-32 -top-32 h-[28rem] w-[28rem] rounded-full opacity-30 blur-[110px]"
        style={{ background: "#6366f1" }}
      />
      <motion.div
        {...float(2.5)}
        className="absolute -right-24 top-10 h-[24rem] w-[24rem] rounded-full opacity-25 blur-[110px]"
        style={{ background: "#ec4899" }}
      />
      <motion.div
        {...float(5)}
        className="absolute left-1/3 top-1/2 h-[22rem] w-[22rem] rounded-full opacity-20 blur-[110px]"
        style={{ background: "#8b5cf6" }}
      />
      <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,black,transparent)]" />
    </div>
  );
}

export default GradientOrbs;

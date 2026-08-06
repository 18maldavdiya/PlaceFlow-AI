import { motion } from "framer-motion";

import { cn } from "@/utils/cn";

/**
 * Consistent "eyebrow + title + description" header used at the top of
 * every landing section, fading/sliding in the first time it scrolls into
 * view.
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && (
        <span className="inline-flex items-center rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
          {eyebrow}
        </span>
      )}
      <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-balance text-base leading-relaxed text-muted sm:text-lg">
          {description}
        </p>
      )}
    </motion.div>
  );
}

export default SectionHeading;

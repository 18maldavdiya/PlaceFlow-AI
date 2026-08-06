import { motion } from "framer-motion";

import { AnimatedCounter } from "@/components/common/AnimatedCounter";
import { STATS } from "@/constants/landing";

export function StatsSection() {
  return (
    <section id="stats" className="border-y border-border bg-surface/50">
      <div className="container py-14 sm:py-16">
        <div className="grid grid-cols-2 gap-8 sm:gap-6 lg:grid-cols-4">
          {STATS.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.5,
                delay: index * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="flex flex-col items-center text-center sm:items-start sm:text-left"
            >
              <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <stat.icon className="h-5 w-5" aria-hidden />
              </span>
              <AnimatedCounter
                value={stat.value}
                suffix={stat.suffix}
                className="text-3xl font-semibold tabular-nums tracking-tight text-foreground sm:text-4xl"
              />
              <p className="mt-1.5 text-sm text-muted">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default StatsSection;

import { motion } from "framer-motion";

import { AnimatedCounter } from "@/components/common/AnimatedCounter";
import { STATS } from "@/constants/landing";

export function StatsSection() {
  return (
    <section id="stats" className="relative py-20 sm:py-24">
      <div className="container">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.5,
                delay: index * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
              whileHover={{ y: -6 }}
              className="group relative rounded-2xl p-px transition-shadow duration-300"
              style={{
                background:
                  "linear-gradient(155deg, rgb(var(--color-primary) / 0.4), rgb(var(--color-primary) / 0.05) 45%, transparent 65%)",
              }}
            >
              <div className="glass relative h-full rounded-[15px] p-6 transition-shadow duration-300 group-hover:shadow-xl group-hover:shadow-primary/10">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                  <stat.icon className="h-5 w-5" aria-hidden />
                </span>

                <AnimatedCounter
                  value={stat.value}
                  suffix={stat.suffix}
                  className="mt-5 block text-3xl font-semibold tabular-nums tracking-tight text-foreground sm:text-4xl"
                />
                <p className="mt-1.5 text-sm font-medium text-foreground">
                  {stat.label}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-muted">
                  {stat.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default StatsSection;

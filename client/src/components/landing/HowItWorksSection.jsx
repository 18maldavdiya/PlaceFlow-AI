import { motion } from "framer-motion";

import { SectionHeading } from "@/components/landing/SectionHeading";
import { HOW_IT_WORKS } from "@/constants/landing";

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-surface/40 py-24 sm:py-32">
      <div className="container">
        <SectionHeading
          eyebrow="How it works"
          title="From sign-up to signed offer, in five steps"
          description="No parallel spreadsheets, no re-entered forms — one path, start to finish."
        />

        {/* Desktop / laptop: horizontal timeline */}
        <div className="mt-20 hidden lg:grid lg:grid-cols-5 lg:gap-6">
          {HOW_IT_WORKS.map((step, index) => {
            const isLast = index === HOW_IT_WORKS.length - 1;
            return (
              <div
                key={step.title}
                className="relative flex flex-col items-center px-2 text-center"
              >
                {!isLast && (
                  <motion.span
                    aria-hidden
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{
                      duration: 0.6,
                      delay: index * 0.15 + 0.3,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    style={{ transformOrigin: "left" }}
                    className="absolute left-1/2 top-7 h-px w-full bg-gradient-to-r from-primary/60 via-primary/30 to-border"
                  />
                )}

                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.15,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  whileHover={{ y: -4, scale: 1.05 }}
                  className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full border border-primary/30 bg-surface text-primary shadow-lg shadow-primary/10"
                >
                  <step.icon className="h-5 w-5" aria-hidden />
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    {index + 1}
                  </span>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.15 + 0.15,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <h3 className="mt-5 text-sm font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted">
                    {step.description}
                  </p>
                </motion.div>
              </div>
            );
          })}
        </div>

        {/* Tablet / mobile: vertical timeline */}
        <div className="mx-auto mt-16 max-w-lg lg:hidden">
          {HOW_IT_WORKS.map((step, index) => {
            const isLast = index === HOW_IT_WORKS.length - 1;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                whileHover={{ x: 4 }}
                className="relative flex gap-5 pb-10 last:pb-0"
              >
                {!isLast && (
                  <motion.span
                    aria-hidden
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{
                      duration: 0.6,
                      delay: index * 0.1 + 0.25,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    style={{ transformOrigin: "top" }}
                    className="absolute left-6 top-14 h-[calc(100%-2.5rem)] w-px bg-gradient-to-b from-primary/50 to-border"
                  />
                )}

                <span className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary">
                  <step.icon className="h-5 w-5" aria-hidden />
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    {index + 1}
                  </span>
                </span>

                <div className="pt-1.5">
                  <h3 className="text-base font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default HowItWorksSection;

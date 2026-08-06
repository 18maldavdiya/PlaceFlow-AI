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

        <div className="mx-auto mt-16 max-w-2xl">
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
                className="relative flex gap-5 pb-10 last:pb-0"
              >
                {!isLast && (
                  <span
                    aria-hidden
                    className="absolute left-6 top-14 h-[calc(100%-2.5rem)] w-px bg-gradient-to-b from-primary/50 to-border"
                  />
                )}

                <span className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary">
                  <step.icon className="h-5 w-5" aria-hidden />
                </span>

                <div className="pt-1.5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                    Step {index + 1}
                  </p>
                  <h3 className="mt-1 text-lg font-semibold text-foreground">
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

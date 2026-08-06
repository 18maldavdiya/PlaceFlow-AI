import { motion } from "framer-motion";

import { SectionHeading } from "@/components/landing/SectionHeading";
import { FEATURES } from "@/constants/landing";

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 sm:py-32">
      <div className="container">
        <SectionHeading
          eyebrow="Features"
          title="Everything a placement season actually needs"
          description="Built around the real workflow — from a raw resume to a signed offer — not a generic list of dashboard widgets."
        />

        <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 0.5,
                delay: (index % 4) * 0.07,
                ease: [0.16, 1, 0.3, 1],
              }}
              whileHover={{ y: -6, scale: 1.015 }}
              className="group relative rounded-2xl p-px transition-shadow duration-300"
              style={{
                background:
                  "linear-gradient(155deg, rgb(var(--color-primary) / 0.35), rgb(var(--color-border)) 55%)",
              }}
            >
              <div className="relative h-full rounded-[15px] bg-surface p-6 shadow-sm transition-shadow duration-300 group-hover:shadow-xl group-hover:shadow-primary/10">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                  <feature.icon className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="mt-5 text-base font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;

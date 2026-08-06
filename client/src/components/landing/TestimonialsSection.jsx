import { motion } from "framer-motion";
import { Quote } from "lucide-react";

import { SectionHeading } from "@/components/landing/SectionHeading";
import { TESTIMONIALS } from "@/constants/landing";

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24 sm:py-32">
      <div className="container">
        <SectionHeading
          eyebrow="About PlaceFlow AI"
          title="Trusted by placement teams, recruiters, and students"
          description="A few of the people running their placement seasons on PlaceFlow AI."
        />

        <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {TESTIMONIALS.map((testimonial, index) => (
            <motion.figure
              key={testimonial.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 0.5,
                delay: (index % 2) * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              whileHover={{ y: -4 }}
              className="rounded-2xl border border-border bg-surface p-7 shadow-sm transition-shadow duration-300 hover:shadow-xl hover:shadow-primary/5"
            >
              <Quote className="h-6 w-6 text-primary/40" aria-hidden />
              <blockquote className="mt-4 text-balance text-base leading-relaxed text-foreground">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white"
                  style={{ background: "var(--gradient-brand)" }}
                  aria-hidden
                >
                  {testimonial.initials}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {testimonial.name}
                  </p>
                  <p className="truncate text-xs text-muted">
                    {testimonial.role} · {testimonial.org}
                  </p>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TestimonialsSection;

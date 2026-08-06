import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/common/Button";
import { BrowserMockup } from "@/components/landing/BrowserMockup";
import { RECRUITER_BENEFITS } from "@/constants/landing";

const PIPELINE = [
  { stage: "Applied", count: 248 },
  { stage: "Shortlisted", count: 64 },
  { stage: "Interviewed", count: 22 },
  { stage: "Offered", count: 9 },
];

const maxCount = Math.max(...PIPELINE.map((p) => p.count));

export function RecruiterSection() {
  return (
    <section id="recruiters" className="bg-surface/40 py-24 sm:py-32">
      <div className="container grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="order-2 lg:order-1"
        >
          <BrowserMockup label="app.placeflow.ai/recruiter/drives">
            <div className="space-y-5 p-5 sm:p-7">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted">
                    SDE Intern — Campus Drive
                  </p>
                  <p className="mt-1 text-base font-semibold text-foreground">
                    Hiring pipeline
                  </p>
                </div>
                <span className="rounded-full bg-success/10 px-2.5 py-1 text-xs font-medium text-success">
                  12 colleges
                </span>
              </div>

              <div className="space-y-3.5">
                {PIPELINE.map((row) => (
                  <div key={row.stage}>
                    <div className="mb-1.5 flex items-center justify-between text-xs">
                      <span className="text-muted">{row.stage}</span>
                      <span className="font-medium text-foreground">
                        {row.count}
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-border/60">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${(row.count / maxCount) * 100}%`,
                          background: "var(--gradient-brand)",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </BrowserMockup>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="order-1 lg:order-2"
        >
          <span className="inline-flex items-center rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            For Recruiters
          </span>
          <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            One dashboard, every campus you hire from
          </h2>
          <p className="mt-4 text-balance text-base leading-relaxed text-muted sm:text-lg">
            Stop repeating drive setup for every college on your calendar.
            Publish once, reach a pre-qualified pool everywhere, and manage the
            whole pipeline without fifteen different logins.
          </p>

          <ul className="mt-8 space-y-3.5">
            {RECRUITER_BENEFITS.map((benefit) => (
              <li key={benefit} className="flex items-start gap-3 text-sm">
                <CheckCircle2
                  className="mt-0.5 h-5 w-5 shrink-0 text-success"
                  aria-hidden
                />
                <span className="text-foreground">{benefit}</span>
              </li>
            ))}
          </ul>

          <Button
            as="a"
            href="#contact"
            variant="gradient"
            size="lg"
            className="mt-9"
          >
            Partner with us
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

export default RecruiterSection;

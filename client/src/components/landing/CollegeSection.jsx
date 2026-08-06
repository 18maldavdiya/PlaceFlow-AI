import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/common/Button";
import { BrowserMockup } from "@/components/landing/BrowserMockup";
import { COLLEGE_BENEFITS } from "@/constants/landing";

const DEPARTMENTS = [
  { name: "Computer Science", placed: 92 },
  { name: "Electronics", placed: 81 },
  { name: "Mechanical", placed: 74 },
];

export function CollegeSection() {
  return (
    <section id="colleges" className="py-24 sm:py-32">
      <div className="container grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="inline-flex items-center rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            For Colleges &amp; TPOs
          </span>
          <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Run placements like a system, not a scramble
          </h2>
          <p className="mt-4 text-balance text-base leading-relaxed text-muted sm:text-lg">
            Give your placement cell one governed workflow instead of a dozen
            spreadsheets, and give leadership live numbers instead of a
            semester-end scramble to compile them.
          </p>

          <ul className="mt-8 space-y-3.5">
            {COLLEGE_BENEFITS.map((benefit) => (
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
            Bring your college onboard
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        >
          <BrowserMockup label="app.placeflow.ai/college/analytics">
            <div className="space-y-5 p-5 sm:p-7">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted">
                  Placement season 2026
                </p>
                <p className="mt-1 text-base font-semibold text-foreground">
                  Department-wise placement rate
                </p>
              </div>

              <div className="space-y-4">
                {DEPARTMENTS.map((dept) => (
                  <div key={dept.name}>
                    <div className="mb-1.5 flex items-center justify-between text-xs">
                      <span className="text-muted">{dept.name}</span>
                      <span className="font-medium text-foreground">
                        {dept.placed}%
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-border/60">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${dept.placed}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-3 border-t border-border pt-4">
                {[
                  { label: "Active drives", value: "18" },
                  { label: "Students eligible", value: "1.2k" },
                  { label: "Offers this month", value: "146" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p className="text-lg font-semibold text-foreground">
                      {stat.value}
                    </p>
                    <p className="mt-0.5 text-[11px] text-muted">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </BrowserMockup>
        </motion.div>
      </div>
    </section>
  );
}

export default CollegeSection;

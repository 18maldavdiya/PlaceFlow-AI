import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  FileText,
  GraduationCap,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/common/Button";
import { STUDENT_BENEFITS } from "@/constants/landing";

export function StudentSection() {
  return (
    <section id="students" className="py-24 sm:py-32">
      <div className="container grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="inline-flex items-center rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            For Students
          </span>
          <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Your entire placement journey, in one profile
          </h2>
          <p className="mt-4 text-balance text-base leading-relaxed text-muted sm:text-lg">
            Stop rebuilding your resume for every recruiter and refreshing your
            inbox for updates. Build your profile once, apply with confidence,
            and always know exactly where you stand.
          </p>

          <ul className="mt-8 space-y-3.5">
            {STUDENT_BENEFITS.map((benefit) => (
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
            Build your profile
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto flex h-80 w-full max-w-md items-center justify-center sm:h-96"
        >
          <div
            aria-hidden
            className="absolute h-64 w-64 rounded-full opacity-30 blur-[80px] sm:h-80 sm:w-80"
            style={{ background: "var(--gradient-brand)" }}
          />

          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="glass absolute left-2 top-4 flex w-40 items-center gap-2.5 rounded-xl border border-border p-3.5 shadow-xl sm:left-6"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <GraduationCap className="h-4 w-4" aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-foreground">
                B.Tech, CSE
              </p>
              <p className="text-[11px] text-muted">Final Year</p>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.6,
            }}
            className="glass absolute right-0 top-16 flex w-44 items-center gap-2.5 rounded-xl border border-border p-3.5 shadow-xl sm:right-4"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-success/15 text-success">
              <FileText className="h-4 w-4" aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-foreground">
                Resume Score
              </p>
              <p className="text-[11px] text-success">92 / 100</p>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{
              duration: 5.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.2,
            }}
            className="glass absolute bottom-4 left-10 flex w-48 items-center gap-2.5 rounded-xl border border-border p-3.5 shadow-xl sm:bottom-8"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <Sparkles className="h-4 w-4" aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-foreground">
                3 New Matches
              </p>
              <p className="text-[11px] text-muted">Eligible drives today</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export default StudentSection;

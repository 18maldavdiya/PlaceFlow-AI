import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  CalendarClock,
  ChevronRight,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/common/Button";
import { BrowserMockup } from "@/components/landing/BrowserMockup";
import { GradientOrbs } from "@/components/landing/GradientOrbs";

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

const floatCard = {
  hidden: { opacity: 0, y: 16, scale: 0.94 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

const STUDENT = { name: "Rohit Sharma", meta: "B.Tech CSE · Final Year" };
const READINESS_SCORE = 92;

const STATS = [
  { label: "Applications", value: "12" },
  { label: "Interviews", value: "3" },
  { label: "Offers", value: "1" },
];

const INTERVIEW = {
  company: "Nimbus Cloud Systems",
  role: "SDE Intern",
  when: "Tomorrow, 10:30 AM",
};

const RECOMMENDATION = {
  company: "Fernbank Analytics",
  role: "Data Analyst",
  match: "97% match",
};

const APPLICATIONS = [
  {
    company: "Nimbus Cloud Systems",
    role: "SDE Intern",
    status: "Interview",
    tone: "primary",
  },
  {
    company: "Fernbank Analytics",
    role: "Data Analyst",
    status: "Offer",
    tone: "success",
  },
  {
    company: "Orbital Robotics",
    role: "Firmware Engineer",
    status: "Applied",
    tone: "muted",
  },
];

const STATUS_STYLES = {
  primary: "bg-primary/10 text-primary",
  success: "bg-success/10 text-success",
  muted: "bg-border/60 text-muted",
};

function FloatingShapes() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
      <motion.span
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className="absolute left-[8%] top-24 hidden h-16 w-16 rounded-2xl border border-primary/20 sm:block"
      />
      <motion.span
        animate={{ rotate: -360 }}
        transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
        className="absolute right-[6%] top-1/3 hidden h-10 w-10 rounded-full border border-primary/25 lg:block"
      />
      <motion.span
        animate={{ y: [0, 14, 0], rotate: [0, 8, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-24 left-[14%] hidden h-8 w-8 rounded-lg border border-primary/20 sm:block"
      />
    </div>
  );
}

export function Hero() {
  return (
    <section
      id="hero"
      className="bg-grid relative overflow-hidden pb-24 pt-16 sm:pb-32 sm:pt-24"
    >
      <GradientOrbs />
      <FloatingShapes />

      <div className="container relative grid grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="mx-auto max-w-xl text-center lg:mx-0 lg:text-left"
        >
          <motion.span
            variants={itemVariants}
            className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-3.5 py-1.5 text-xs font-semibold text-primary"
          >
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            100+ colleges already on PlaceFlow AI
          </motion.span>

          <motion.h1
            variants={itemVariants}
            className="mt-6 text-balance text-4xl font-semibold leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-[3.25rem]"
          >
            AI Powered{" "}
            <span className="gradient-text">Campus Placement Platform</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mx-auto mt-6 max-w-md text-balance text-base leading-relaxed text-muted sm:text-lg lg:mx-0"
          >
            Connect Students, Recruiters and Colleges on one intelligent
            platform.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start"
          >
            <Button
              as="a"
              href="#contact"
              variant="gradient"
              size="xl"
              className="w-full sm:w-auto"
            >
              Get Started
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Button>
            <Button
              as="a"
              href="#features"
              variant="secondary"
              size="xl"
              className="w-full sm:w-auto"
            >
              Explore Features
              <ChevronRight className="h-4 w-4" aria-hidden />
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="show"
          className="relative mx-auto w-full max-w-md lg:max-w-none"
        >
          <BrowserMockup label="app.placeflow.ai/dashboard">
            <div className="space-y-3 p-4 sm:p-5">
              {/* Student Profile Card + Placement Readiness Score */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-3 rounded-xl border border-border bg-surface p-3.5">
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
                    style={{ background: "var(--gradient-brand)" }}
                    aria-hidden
                  >
                    RS
                  </span>
                  <div className="min-w-0">
                    <p className="flex items-center gap-1 truncate text-xs font-semibold text-foreground">
                      {STUDENT.name}
                      <BadgeCheck
                        className="h-3.5 w-3.5 shrink-0 text-primary"
                        aria-hidden
                      />
                    </p>
                    <p className="truncate text-[11px] text-muted">
                      {STUDENT.meta}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-border bg-surface p-3.5">
                  <div className="relative h-11 w-11 shrink-0">
                    <div
                      className="h-11 w-11 rounded-full"
                      style={{
                        background: `conic-gradient(rgb(var(--color-primary)) ${READINESS_SCORE * 3.6}deg, rgb(var(--color-border)) 0deg)`,
                      }}
                      aria-hidden
                    />
                    <div className="absolute inset-[3px] flex items-center justify-center rounded-full bg-surface text-[10px] font-semibold text-foreground">
                      {READINESS_SCORE}%
                    </div>
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold text-foreground">
                      Readiness
                    </p>
                    <p className="truncate text-[11px] text-muted">
                      Placement score
                    </p>
                  </div>
                </div>
              </div>

              {/* Statistics Cards */}
              <div className="grid grid-cols-3 gap-3">
                {STATS.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-xl border border-border bg-surface p-3.5"
                  >
                    <p className="text-xl font-semibold text-foreground">
                      {stat.value}
                    </p>
                    <p className="mt-0.5 text-[11px] text-muted">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>

              {/* Upcoming Interview + Job Recommendation */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-border bg-surface p-3.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <CalendarClock className="h-4 w-4" aria-hidden />
                  </span>
                  <p className="mt-2.5 truncate text-xs font-semibold text-foreground">
                    {INTERVIEW.company}
                  </p>
                  <p className="truncate text-[11px] text-muted">
                    {INTERVIEW.role} · {INTERVIEW.when}
                  </p>
                </div>

                <div className="rounded-xl border border-border bg-surface p-3.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-success/10 text-success">
                    <Sparkles className="h-4 w-4" aria-hidden />
                  </span>
                  <p className="mt-2.5 truncate text-xs font-semibold text-foreground">
                    {RECOMMENDATION.company}
                  </p>
                  <p className="truncate text-[11px] text-success">
                    {RECOMMENDATION.match}
                  </p>
                </div>
              </div>

              {/* Recent Applications */}
              <div className="rounded-xl border border-border bg-surface p-3.5">
                <p className="text-[11px] font-medium text-muted">
                  Recent applications
                </p>
                <ul className="mt-2.5 space-y-2.5">
                  {APPLICATIONS.map((app) => (
                    <li
                      key={app.company}
                      className="flex items-center justify-between gap-3 text-sm"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-xs font-medium text-foreground">
                          {app.company}
                        </p>
                        <p className="truncate text-[11px] text-muted">
                          {app.role}
                        </p>
                      </div>
                      <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium ${STATUS_STYLES[app.tone]}`}
                      >
                        {app.status}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </BrowserMockup>

          {/* Two-layer motion on purpose: the outer div owns the one-time
              entrance (variants, resolved against the parent's hidden/show
              propagation); the inner div owns the continuous float loop.
              Combining both on one element would make a literal `animate`
              override the variant-driven opacity/scale target, leaving the
              card stuck invisible at its "hidden" state. */}
          <motion.div
            variants={floatCard}
            className="absolute -left-6 top-6 hidden sm:block"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="glass flex items-center gap-2.5 rounded-xl border border-border p-3 shadow-xl"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <Sparkles className="h-4 w-4" aria-hidden />
              </span>
              <div>
                <p className="text-xs font-semibold text-foreground">
                  New job match
                </p>
                <p className="text-[11px] text-muted">Updated just now</p>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            variants={floatCard}
            className="absolute -right-6 bottom-10 hidden md:block"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
              className="glass flex items-center gap-2.5 rounded-xl border border-border p-3 shadow-xl"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-success/15 text-success">
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              </span>
              <div>
                <p className="text-xs font-semibold text-foreground">
                  Interview confirmed
                </p>
                <p className="text-[11px] text-muted">Nimbus Cloud Systems</p>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;

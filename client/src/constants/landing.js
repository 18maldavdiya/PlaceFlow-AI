import {
  Briefcase,
  Building2,
  FileSearch,
  FileText,
  Gauge,
  Github,
  GraduationCap,
  Instagram,
  Landmark,
  Linkedin,
  Mail,
  Map,
  Mic,
  Send,
  Sparkles,
  Trophy,
  UploadCloud,
  UserPlus,
  UserRoundCheck,
} from "lucide-react";

/**
 * All copy and structured content for the landing page lives here, kept
 * separate from the section components that render it — makes copy edits
 * (and, later, a CMS/API swap) a one-file change instead of a component hunt.
 */

export const NAV_LINKS = Object.freeze([
  { label: "Home", href: "#hero" },
  { label: "Features", href: "#features" },
  { label: "For Students", href: "#students" },
  { label: "For Recruiters", href: "#recruiters" },
  { label: "For Colleges", href: "#colleges" },
  { label: "About", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
]);

export const STATS = Object.freeze([
  { icon: Building2, value: 100, suffix: "+", label: "Colleges onboard" },
  {
    icon: GraduationCap,
    value: 25000,
    suffix: "+",
    label: "Students placed on",
  },
  { icon: Briefcase, value: 500, suffix: "+", label: "Recruiters hiring" },
  { icon: Trophy, value: 10000, suffix: "+", label: "Successful placements" },
]);

export const FEATURES = Object.freeze([
  {
    icon: FileSearch,
    title: "AI Resume Review",
    description:
      "Get instant, line-by-line feedback on formatting, keywords, and impact — the same checks a recruiter's ATS runs, before you ever hit submit.",
  },
  {
    icon: FileText,
    title: "Resume Builder",
    description:
      "Build a polished, recruiter-ready resume from a guided profile — no formatting battles, just clean templates that pass every parser.",
  },
  {
    icon: Gauge,
    title: "Placement Readiness Score",
    description:
      "A single, honest score across academics, skills, and profile completeness — so you know exactly what's holding an application back.",
  },
  {
    icon: Sparkles,
    title: "Smart Job Recommendation",
    description:
      "Drives are matched to your profile automatically — eligible, relevant roles surface first, instead of scrolling through everything on offer.",
  },
  {
    icon: Mic,
    title: "AI Mock Interview",
    description:
      "Practice with realistic, role-specific questions and get structured feedback on clarity, pacing, and technical depth — before the real one.",
  },
  {
    icon: Map,
    title: "Career Roadmap",
    description:
      "A personalized path from where you are to the role you want, broken into concrete milestones instead of vague advice.",
  },
  {
    icon: UserRoundCheck,
    title: "Application Tracking",
    description:
      "Every application, interview, and offer in one live timeline — no more refreshing your inbox to know where things stand.",
  },
]);

export const HOW_IT_WORKS = Object.freeze([
  {
    icon: UserPlus,
    title: "Create Account",
    description: "Sign up in seconds with your college email and role.",
  },
  {
    icon: UserRoundCheck,
    title: "Complete Profile",
    description: "Add your academics, skills, and projects — once.",
  },
  {
    icon: UploadCloud,
    title: "Upload Resume",
    description: "Let the AI reviewer check it before recruiters do.",
  },
  {
    icon: Send,
    title: "Apply to Jobs",
    description: "Apply to every eligible drive with one click.",
  },
  {
    icon: Trophy,
    title: "Get Placed",
    description: "Track offers, accept the right one, and get placed.",
  },
]);

export const STUDENT_BENEFITS = Object.freeze([
  "One profile, every eligible drive — no repeated forms",
  "AI resume review before recruiters ever see it",
  "Real-time status on every application and interview",
  "A career roadmap that's actually specific to you",
]);

export const RECRUITER_BENEFITS = Object.freeze([
  "Post once, reach every partner college at the same time",
  "Shortlist from a pre-filtered, eligibility-matched pool",
  "Schedule interviews and collect structured feedback in one place",
  "One dashboard instead of a different portal per campus",
]);

export const COLLEGE_BENEFITS = Object.freeze([
  "Replace spreadsheets with one governed placement workflow",
  "Live, accreditation-ready analytics — no manual compilation",
  "Full audit trail on every drive, offer, and approval",
  "A recruiter network that grows your placement outcomes",
]);

export const TESTIMONIALS = Object.freeze([
  {
    name: "Ananya Verma",
    role: "Training & Placement Officer",
    org: "Vishwakarma Institute of Technology",
    initials: "AV",
    quote:
      "We ran forty drives last season without a single spreadsheet. The eligibility engine alone gave our team back a full week every month.",
  },
  {
    name: "Rohit Sharma",
    role: "Final-Year Student, B.Tech CSE",
    org: "Placed at a Series-B product company",
    initials: "RS",
    quote:
      "The AI resume review caught things three seniors missed. I knew exactly where I stood on every application instead of guessing.",
  },
  {
    name: "Karan Malhotra",
    role: "Campus Hiring Lead",
    org: "Mid-size product company, 15 campuses/season",
    initials: "KM",
    quote:
      "One dashboard for every college we hire from. Setup that used to take a week per campus now takes an afternoon, total.",
  },
  {
    name: "Meera Iyer",
    role: "Registrar",
    org: "Autonomous engineering college, Pune",
    initials: "MI",
    quote:
      "Our NAAC placement report used to take three people two weeks. Now it's a live dashboard we just export.",
  },
]);

export const FAQS = Object.freeze([
  {
    question: "Is PlaceFlow AI free for students?",
    answer:
      "Yes. Every core student feature — profile, resume builder, AI review, applications, and tracking — is free for students at partner colleges. Your college's TPO handles the institutional subscription.",
  },
  {
    question: "How does a college get started with PlaceFlow AI?",
    answer:
      "A TPO or college admin requests onboarding, and we walk the placement cell through a guided setup: departments, batches, and eligibility rules are configured before any student is invited.",
  },
  {
    question: "How accurate is the AI resume review?",
    answer:
      "The reviewer checks the same structural and keyword signals most applicant-tracking systems use, plus role-specific phrasing. It's a strong first pass — not a replacement for a mentor's judgment on content.",
  },
  {
    question: "Can one recruiter post a drive across multiple colleges?",
    answer:
      "Yes — that's the core of the platform. A recruiter configures a drive once and publishes it to every partner college they're connected with, each still gated by that college's own eligibility rules.",
  },
  {
    question: "Is our placement data shared with other colleges?",
    answer:
      "No. Every college's student and placement data is isolated by default. Nothing crosses institutional boundaries unless your college explicitly opts a drive into a shared, consortium-wide listing.",
  },
  {
    question: "Do recruiters pay to use PlaceFlow AI?",
    answer:
      "Core recruiter tools — posting drives, shortlisting, and scheduling — are free. Optional premium tools, like advanced analytics and priority visibility, are available on a recruiter subscription.",
  },
  {
    question: "What happens to our data if we stop using the platform?",
    answer:
      "You can export your full placement history at any time. Institutional data is retained per our standard retention policy and fully removable on request once a college's subscription ends.",
  },
  {
    question: "Does PlaceFlow AI replace our existing college ERP?",
    answer:
      "No — it focuses specifically on placement and career management, and is built to sit alongside your existing student ERP rather than replace it.",
  },
]);

export const SOCIAL_LINKS = Object.freeze([
  { label: "LinkedIn", href: "#", icon: Linkedin },
  { label: "Email", href: "mailto:hello@placeflow.ai", icon: Mail },
  { label: "Instagram", href: "#", icon: Instagram },
  { label: "GitHub", href: "#", icon: Github },
]);

export const FOOTER_LINK_GROUPS = Object.freeze([
  {
    heading: "Quick Links",
    links: [
      { label: "Home", href: "#hero" },
      { label: "Features", href: "#features" },
      { label: "For Students", href: "#students" },
      { label: "For Recruiters", href: "#recruiters" },
      { label: "For Colleges", href: "#colleges" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "How It Works", href: "#how-it-works" },
      { label: "FAQ", href: "#faq" },
      { label: "Testimonials", href: "#testimonials" },
      { label: "Contact", href: "#contact" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Contact", href: "#contact" },
    ],
  },
]);

export const AUDIENCE_ICONS = Object.freeze({
  students: GraduationCap,
  recruiters: Briefcase,
  colleges: Landmark,
});

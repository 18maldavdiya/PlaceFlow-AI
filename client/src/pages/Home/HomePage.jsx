import { CollegeSection } from "@/components/landing/CollegeSection";
import { ContactSection } from "@/components/landing/ContactSection";
import { FAQSection } from "@/components/landing/FAQSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { Hero } from "@/components/landing/Hero";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { RecruiterSection } from "@/components/landing/RecruiterSection";
import { StatsSection } from "@/components/landing/StatsSection";
import { StudentSection } from "@/components/landing/StudentSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";

/**
 * PlaceFlow AI marketing landing page — the site's `/` route. Composed
 * entirely from `components/landing/*` sections; this file only owns
 * ordering. Navbar and Footer are not rendered here — they're app-wide
 * chrome owned by layouts/RootLayout.jsx.
 */
export function HomePage() {
  return (
    <>
      <Hero />
      <StatsSection />
      <FeaturesSection />
      <HowItWorksSection />
      <StudentSection />
      <RecruiterSection />
      <CollegeSection />
      <TestimonialsSection />
      <FAQSection />
      <ContactSection />
    </>
  );
}

export default HomePage;

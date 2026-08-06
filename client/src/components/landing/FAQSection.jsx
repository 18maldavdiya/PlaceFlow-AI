import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";

import { SectionHeading } from "@/components/landing/SectionHeading";
import { FAQS } from "@/constants/landing";
import { cn } from "@/utils/cn";

function AccordionItem({ index, question, answer, isOpen, onToggle }) {
  const panelId = `faq-panel-${index}`;
  const buttonId = `faq-trigger-${index}`;

  return (
    <div className="border-b border-border py-2">
      <h3>
        <button
          id={buttonId}
          type="button"
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={onToggle}
          className="flex w-full items-center justify-between gap-4 py-4 text-left"
        >
          <span className="text-sm font-medium text-foreground sm:text-base">
            {question}
          </span>
          <motion.span
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border text-muted",
              isOpen && "border-primary/40 text-primary",
            )}
          >
            <Plus className="h-4 w-4" aria-hidden />
          </motion.span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={buttonId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="pb-4 pr-12 text-sm leading-relaxed text-muted">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="bg-surface/40 py-24 sm:py-32">
      <div className="container">
        <SectionHeading
          eyebrow="FAQ"
          title="Frequently asked questions"
          description="Everything students, recruiters, and colleges usually ask before getting started."
        />

        <div className="mx-auto mt-14 max-w-2xl">
          {FAQS.map((faq, index) => (
            <AccordionItem
              key={faq.question}
              index={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onToggle={() =>
                setOpenIndex((current) => (current === index ? -1 : index))
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default FAQSection;

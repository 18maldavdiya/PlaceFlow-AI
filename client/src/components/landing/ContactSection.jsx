import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

import { Button } from "@/components/common/Button";
import { SectionHeading } from "@/components/landing/SectionHeading";
import { SOCIAL_LINKS } from "@/constants/landing";
import { cn } from "@/utils/cn";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name"),
  email: z.string().trim().email("Enter a valid email address"),
  role: z.enum(["student", "recruiter", "college"]),
  message: z
    .string()
    .trim()
    .min(10, "Tell us a little more (at least 10 characters)"),
});

const fieldClass =
  "w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30";

function FormField({ label, htmlFor, error, children }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="text-xs font-medium text-muted">
        {label}
      </label>
      <div className="mt-1.5">{children}</div>
      {error && <p className="mt-1.5 text-xs text-danger">{error}</p>}
    </div>
  );
}

export function ContactSection() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", role: "student", message: "" },
  });

  async function onSubmit(values) {
    // No backend endpoint exists yet for this form — this simulates the
    // round trip so validation and submit UX can be verified end to end.
    // Swap for a real `services/contactService.js` call once that API ships.
    await new Promise((resolve) => setTimeout(resolve, 900));
    toast.success(
      `Thanks, ${values.name.split(" ")[0]} — we'll be in touch soon.`,
    );
    reset();
  }

  return (
    <section id="contact" className="py-24 sm:py-32">
      <div className="container">
        <SectionHeading
          eyebrow="Contact"
          title="Let's bring PlaceFlow AI to your campus"
          description="Whether you're a TPO, a recruiter, or a student with a question — reach out and we'll get back within a day."
        />

        <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 lg:grid-cols-[1.15fr_1fr]">
          <motion.form
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="space-y-5 rounded-2xl border border-border bg-surface p-6 shadow-sm sm:p-8"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField
                label="Full name"
                htmlFor="name"
                error={errors.name?.message}
              >
                <input
                  id="name"
                  type="text"
                  placeholder="Ananya Verma"
                  className={fieldClass}
                  {...register("name")}
                />
              </FormField>

              <FormField
                label="Email address"
                htmlFor="email"
                error={errors.email?.message}
              >
                <input
                  id="email"
                  type="email"
                  placeholder="you@college.edu"
                  className={fieldClass}
                  {...register("email")}
                />
              </FormField>
            </div>

            <FormField
              label="I am a..."
              htmlFor="role"
              error={errors.role?.message}
            >
              <select
                id="role"
                className={cn(fieldClass, "cursor-pointer")}
                {...register("role")}
              >
                <option value="student">Student</option>
                <option value="recruiter">Recruiter</option>
                <option value="college">College / TPO</option>
              </select>
            </FormField>

            <FormField
              label="Message"
              htmlFor="message"
              error={errors.message?.message}
            >
              <textarea
                id="message"
                rows={5}
                placeholder="Tell us a bit about what you're looking for..."
                className={cn(fieldClass, "resize-none")}
                {...register("message")}
              />
            </FormField>

            <Button
              type="submit"
              variant="gradient"
              size="lg"
              isLoading={isSubmitting}
              className="w-full sm:w-auto"
            >
              Send message
              <Send className="h-4 w-4" aria-hidden />
            </Button>
          </motion.form>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-6"
          >
            <div className="space-y-4 rounded-2xl border border-border bg-surface p-6">
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Mail className="h-4 w-4" aria-hidden />
                </span>
                <div>
                  <p className="text-sm font-medium text-foreground">Email</p>
                  <p className="text-sm text-muted">hello@placeflow.ai</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Phone className="h-4 w-4" aria-hidden />
                </span>
                <div>
                  <p className="text-sm font-medium text-foreground">Phone</p>
                  <p className="text-sm text-muted">+91 20 4567 8900</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <MapPin className="h-4 w-4" aria-hidden />
                </span>
                <div>
                  <p className="text-sm font-medium text-foreground">Office</p>
                  <p className="text-sm text-muted">Pune, Maharashtra, India</p>
                </div>
              </div>

              <div className="flex items-center gap-2 border-t border-border pt-4">
                {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted transition-colors hover:border-primary/40 hover:text-primary"
                  >
                    <Icon className="h-4 w-4" aria-hidden />
                  </a>
                ))}
              </div>
            </div>

            <div className="bg-grid relative h-56 flex-1 overflow-hidden rounded-2xl border border-border bg-surface">
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <MapPin className="h-5 w-5" aria-hidden />
                </span>
                <p className="text-sm font-medium text-foreground">
                  Pune, Maharashtra, India
                </p>
                <p className="text-xs text-muted">Map preview</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default ContactSection;

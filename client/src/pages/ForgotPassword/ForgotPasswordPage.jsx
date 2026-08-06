import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { KeyRound, MailCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { AuthCard } from "@/components/common/AuthCard";
import { Button } from "@/components/common/Button";
import { FormInput } from "@/components/common/FormInput";
import { ROUTES } from "@/constants/routes";
import {
  clearAuthError,
  forgotPasswordRequest,
} from "@/store/slices/authSlice";
import { forgotPasswordSchema } from "@/utils/validationSchemas";

export function ForgotPasswordPage() {
  const dispatch = useDispatch();
  const { error, status } = useSelector((state) => state.auth);
  const isSubmitting = status === "loading";
  const [sentInfo, setSentInfo] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit(values) {
    dispatch(clearAuthError());
    try {
      const result = await dispatch(forgotPasswordRequest(values)).unwrap();
      setSentInfo({ email: values.email, mockResetUrl: result.mockResetUrl });
    } catch {
      // Error banner below reads from Redux state — nothing else to do here.
    }
  }

  if (sentInfo) {
    return (
      <div className="w-full max-w-md">
        <AuthCard
          icon={MailCheck}
          title="Check your email"
          subtitle="Password reset instructions are on their way"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="space-y-4 text-center"
          >
            <p className="text-sm leading-relaxed text-muted">
              If an account exists for{" "}
              <span className="font-medium text-foreground">
                {sentInfo.email}
              </span>
              , we&rsquo;ve sent a link to reset the password.
            </p>

            {sentInfo.mockResetUrl && (
              <div className="rounded-lg border border-dashed border-primary/30 bg-primary/5 p-3.5 text-left">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-primary">
                  Dev mode — no email provider configured yet
                </p>
                <p className="mt-1 text-xs text-muted">
                  In production this link is emailed. For now, continue
                  directly:
                </p>
                <Button
                  as="a"
                  href={sentInfo.mockResetUrl}
                  variant="secondary"
                  size="sm"
                  className="mt-2.5 w-full"
                >
                  Open reset link
                </Button>
              </div>
            )}

            <Link
              to={ROUTES.LOGIN}
              className="block text-sm font-medium text-primary hover:underline"
            >
              Back to login
            </Link>
          </motion.div>
        </AuthCard>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <AuthCard
        icon={KeyRound}
        title="Forgot your password?"
        subtitle="Enter your email and we'll send you a reset link"
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-4"
        >
          <FormInput
            label="Email address"
            type="email"
            autoComplete="email"
            error={errors.email?.message}
            {...register("email")}
          />

          {error && (
            <p
              role="alert"
              className="rounded-lg bg-danger/10 px-3.5 py-2.5 text-sm text-danger"
            >
              {error}
            </p>
          )}

          <Button
            type="submit"
            variant="gradient"
            size="lg"
            isLoading={isSubmitting}
            className="w-full"
          >
            Send reset link
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          Remembered your password?{" "}
          <Link
            to={ROUTES.LOGIN}
            className="font-medium text-primary hover:underline"
          >
            Log in
          </Link>
        </p>
      </AuthCard>
    </div>
  );
}

export default ForgotPasswordPage;

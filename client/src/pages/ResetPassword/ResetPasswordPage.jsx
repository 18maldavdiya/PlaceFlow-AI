import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { CheckCircle2, ShieldCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";

import { AuthCard } from "@/components/common/AuthCard";
import { Button } from "@/components/common/Button";
import { PasswordInput } from "@/components/common/PasswordInput";
import { ROUTES } from "@/constants/routes";
import { clearAuthError, resetPasswordRequest } from "@/store/slices/authSlice";
import { resetPasswordSchema } from "@/utils/validationSchemas";

export function ResetPasswordPage() {
  const { token } = useParams();
  const dispatch = useDispatch();
  const { error, status } = useSelector((state) => state.auth);
  const isSubmitting = status === "loading";
  const [isDone, setIsDone] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  async function onSubmit(values) {
    dispatch(clearAuthError());
    try {
      await dispatch(resetPasswordRequest({ token, ...values })).unwrap();
      setIsDone(true);
    } catch {
      // Error banner below reads from Redux state — the link may be
      // invalid/expired, which is a normal outcome, not a crash.
    }
  }

  if (isDone) {
    return (
      <div className="w-full max-w-md">
        <AuthCard
          icon={CheckCircle2}
          title="Password reset"
          subtitle="You can now log in with your new password"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Button
              as={Link}
              to={ROUTES.LOGIN}
              variant="gradient"
              size="lg"
              className="w-full"
            >
              Continue to login
            </Button>
          </motion.div>
        </AuthCard>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <AuthCard
        icon={ShieldCheck}
        title="Set a new password"
        subtitle="Choose a strong password for your account"
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-4"
        >
          <PasswordInput
            label="New password"
            autoComplete="new-password"
            error={errors.password?.message}
            {...register("password")}
          />
          <PasswordInput
            label="Confirm new password"
            autoComplete="new-password"
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />

          {error && (
            <div
              className="rounded-lg bg-danger/10 px-3.5 py-2.5 text-sm text-danger"
              role="alert"
            >
              <p>{error}</p>
              <Link
                to={ROUTES.FORGOT_PASSWORD}
                className="mt-1 inline-block font-medium underline"
              >
                Request a new reset link
              </Link>
            </div>
          )}

          <Button
            type="submit"
            variant="gradient"
            size="lg"
            isLoading={isSubmitting}
            className="w-full"
          >
            Reset password
          </Button>
        </form>
      </AuthCard>
    </div>
  );
}

export default ResetPasswordPage;

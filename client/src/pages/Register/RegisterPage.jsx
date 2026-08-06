import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { MailCheck, UserPlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { AuthCard } from "@/components/common/AuthCard";
import { Button } from "@/components/common/Button";
import { FormInput } from "@/components/common/FormInput";
import { PasswordInput } from "@/components/common/PasswordInput";
import { PUBLIC_REGISTRATION_ROLES, ROLE_LABELS, ROLES } from "@/constants/app";
import { ROUTES } from "@/constants/routes";
import { clearAuthError, registerUser } from "@/store/slices/authSlice";
import { cn } from "@/utils/cn";
import { registerSchema } from "@/utils/validationSchemas";

// Admin and TPO accounts are created by an authenticated admin panel, not
// public self-registration — see PUBLIC_REGISTRATION_ROLES for why.
const ROLE_OPTIONS = PUBLIC_REGISTRATION_ROLES;

const selectClass =
  "peer w-full rounded-lg border border-border bg-background px-3.5 pb-2 pt-4 text-sm text-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30";

export function RegisterPage() {
  const dispatch = useDispatch();
  const { error, status } = useSelector((state) => state.auth);
  const isSubmittingRegister = status === "loading";
  const [successInfo, setSuccessInfo] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      role: ROLES.STUDENT,
      college: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values) {
    dispatch(clearAuthError());
    try {
      const result = await dispatch(registerUser(values)).unwrap();
      setSuccessInfo({
        email: values.email,
        mockVerificationUrl: result.mockVerificationUrl,
      });
    } catch {
      // Error banner below reads from Redux state — nothing else to do here.
    }
  }

  if (successInfo) {
    return (
      <div className="w-full max-w-md">
        <AuthCard
          icon={MailCheck}
          title="Check your email"
          subtitle="One more step to activate your account"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="space-y-4 text-center"
          >
            <p className="text-sm leading-relaxed text-muted">
              We&rsquo;ve sent a verification link to{" "}
              <span className="font-medium text-foreground">
                {successInfo.email}
              </span>
              . Click it to activate your account, then log in.
            </p>

            {successInfo.mockVerificationUrl && (
              <div className="rounded-lg border border-dashed border-primary/30 bg-primary/5 p-3.5 text-left">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-primary">
                  Dev mode — no email provider configured yet
                </p>
                <p className="mt-1 text-xs text-muted">
                  In production this link is emailed. For now, verify directly:
                </p>
                <Button
                  as="a"
                  href={successInfo.mockVerificationUrl}
                  variant="secondary"
                  size="sm"
                  className="mt-2.5 w-full"
                >
                  Simulate email verification
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
    <div className="w-full max-w-lg">
      <AuthCard
        icon={UserPlus}
        title="Create your account"
        subtitle="Join PlaceFlow AI in a few seconds"
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-4"
        >
          <FormInput
            label="Full name"
            autoComplete="name"
            error={errors.fullName?.message}
            {...register("fullName")}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput
              label="Email address"
              type="email"
              autoComplete="email"
              error={errors.email?.message}
              {...register("email")}
            />
            <FormInput
              label="Phone number"
              type="tel"
              autoComplete="tel"
              error={errors.phoneNumber?.message}
              {...register("phoneNumber")}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="relative">
              <select
                id="role"
                className={cn(selectClass, "cursor-pointer")}
                defaultValue={ROLES.STUDENT}
                {...register("role")}
              >
                {ROLE_OPTIONS.map((role) => (
                  <option key={role} value={role}>
                    {ROLE_LABELS[role]}
                  </option>
                ))}
              </select>
              <label
                htmlFor="role"
                className="pointer-events-none absolute left-3.5 top-3 -translate-y-1/2 text-[11px] text-muted"
              >
                I am a...
              </label>
              {errors.role?.message && (
                <p role="alert" className="mt-1.5 text-xs text-danger">
                  {errors.role.message}
                </p>
              )}
            </div>

            <FormInput
              label="College (optional)"
              autoComplete="organization"
              error={errors.college?.message}
              {...register("college")}
            />
          </div>

          <PasswordInput
            label="Password"
            autoComplete="new-password"
            error={errors.password?.message}
            {...register("password")}
          />
          <PasswordInput
            label="Confirm password"
            autoComplete="new-password"
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
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
            isLoading={isSubmittingRegister}
            className="w-full"
          >
            Create account
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          Already have an account?{" "}
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

export default RegisterPage;

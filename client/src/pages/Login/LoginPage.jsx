import { zodResolver } from "@hookform/resolvers/zod";
import { LogIn } from "lucide-react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { AuthCard } from "@/components/common/AuthCard";
import { Button } from "@/components/common/Button";
import { FormInput } from "@/components/common/FormInput";
import { PasswordInput } from "@/components/common/PasswordInput";
import { ROLES } from "@/constants/app";
import { ROUTES } from "@/constants/routes";
import { clearAuthError, loginUser } from "@/store/slices/authSlice";
import { loginSchema } from "@/utils/validationSchemas";

export function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { error, status } = useSelector((state) => state.auth);
  const isSubmittingLogin = status === "loading";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values) {
    dispatch(clearAuthError());
    try {
      const result = await dispatch(loginUser(values)).unwrap();
      toast.success(`Welcome back, ${result.user.fullName.split(" ")[0]}!`);
      // A redirect the user was already bounced from (e.g. a protected
      // dashboard route) takes priority; otherwise Students land on their
      // dashboard and every other role lands on the marketing home page,
      // since no other role has a dashboard built yet.
      const defaultDestination =
        result.user.role === ROLES.STUDENT
          ? ROUTES.STUDENT_DASHBOARD
          : ROUTES.HOME;
      const redirectTo = location.state?.from?.pathname ?? defaultDestination;
      navigate(redirectTo, { replace: true });
    } catch {
      // Error banner below reads from Redux state — nothing else to do here.
    }
  }

  return (
    <div className="w-full max-w-md">
      <AuthCard
        icon={LogIn}
        title="Welcome back"
        subtitle="Log in to your PlaceFlow AI account"
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
          <PasswordInput
            label="Password"
            autoComplete="current-password"
            error={errors.password?.message}
            {...register("password")}
          />

          <div className="flex justify-end">
            <Link
              to={ROUTES.FORGOT_PASSWORD}
              className="text-xs font-medium text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>

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
            isLoading={isSubmittingLogin}
            className="w-full"
          >
            Log in
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          Don&rsquo;t have an account?{" "}
          <Link
            to={ROUTES.REGISTER}
            className="font-medium text-primary hover:underline"
          >
            Register
          </Link>
        </p>
      </AuthCard>
    </div>
  );
}

export default LoginPage;

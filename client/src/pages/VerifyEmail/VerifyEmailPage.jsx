import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { AuthCard } from "@/components/common/AuthCard";
import { Button } from "@/components/common/Button";
import { Spinner } from "@/components/common/Spinner";
import { ROUTES } from "@/constants/routes";
import { verifyEmail } from "@/services/authService";

/**
 * "Email Verification Success" page — the link a user clicks from their
 * (currently mocked) verification email. Calls the verify endpoint on
 * mount; a failed/expired token redirects to the dedicated InvalidLinkPage
 * rather than showing an inline error, per the spec's two-distinct-outcomes
 * design.
 */
export function VerifyEmailPage() {
  const { token } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["verify-email", token],
    queryFn: () => verifyEmail(token),
    retry: false,
    enabled: Boolean(token),
  });

  useEffect(() => {
    if (!token || isError) {
      navigate(ROUTES.INVALID_LINK, { replace: true });
    }
  }, [token, isError, navigate]);

  if (isLoading || isError || !token) {
    return (
      <div className="w-full max-w-md">
        <AuthCard title="Verifying your email...">
          <div className="flex justify-center py-4">
            <Spinner size={28} />
          </div>
        </AuthCard>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <AuthCard
        icon={CheckCircle2}
        title="Email verified"
        subtitle={`${data?.user?.fullName ?? "Your account"} is ready to go`}
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

export default VerifyEmailPage;

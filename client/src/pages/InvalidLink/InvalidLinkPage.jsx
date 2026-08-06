import { LinkIcon } from "lucide-react";
import { Link } from "react-router-dom";

import { AuthCard } from "@/components/common/AuthCard";
import { Button } from "@/components/common/Button";
import { ROUTES } from "@/constants/routes";

/**
 * Shown when a verification (or other tokenized) link is invalid, expired,
 * or already used — a dedicated outcome distinct from VerifyEmailPage's
 * success state and from the generic 404 (NotFoundPage), since the failure
 * reason here is specific and actionable.
 */
export function InvalidLinkPage() {
  return (
    <div className="w-full max-w-md">
      <AuthCard
        icon={LinkIcon}
        title="This link is invalid"
        subtitle="It may have expired, already been used, or been copied incorrectly"
      >
        <div className="flex flex-col gap-2.5">
          <Button
            as={Link}
            to={ROUTES.FORGOT_PASSWORD}
            variant="secondary"
            size="lg"
            className="w-full"
          >
            Request a new link
          </Button>
          <Button
            as={Link}
            to={ROUTES.LOGIN}
            variant="ghost"
            size="lg"
            className="w-full"
          >
            Back to login
          </Button>
        </div>
      </AuthCard>
    </div>
  );
}

export default InvalidLinkPage;

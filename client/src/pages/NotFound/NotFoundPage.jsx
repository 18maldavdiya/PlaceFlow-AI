import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import { Button } from "@/components/common/Button";
import { ROUTES } from "@/constants/routes";

export function NotFoundPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="mx-auto flex max-w-md flex-col items-center gap-4 py-16 text-center"
    >
      <span className="font-mono text-sm text-muted">404</span>
      <h1 className="text-xl font-semibold tracking-tight">Page not found</h1>
      <p className="text-sm text-muted">
        The page you're looking for doesn't exist or has moved.
      </p>
      <Button as={Link} to={ROUTES.HOME} variant="secondary" size="sm">
        Back to home
      </Button>
    </motion.div>
  );
}

export default NotFoundPage;

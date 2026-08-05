import { motion } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { Spinner } from "@/components/common/Spinner";
import { QUERY_KEYS } from "@/constants/app";
import { getServerHealth } from "@/services/healthService";
import { cn } from "@/utils/cn";

/**
 * Scaffold landing page — not a business page. Its only job right now is to
 * prove the foundation is wired end to end: Vite -> Axios -> API proxy ->
 * Express /health route -> React Query -> UI. Replace with the real
 * marketing/dashboard entry point once feature work begins.
 */
export function HomePage() {
  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [QUERY_KEYS.HEALTH],
    queryFn: getServerHealth,
    retry: 0,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="mx-auto max-w-2xl space-y-8"
    >
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          PlaceFlow AI — project foundation
        </h1>
        <p className="text-sm text-muted">
          Client scaffold initialized. No business features are implemented
          yet — this screen only verifies the stack is wired correctly.
        </p>
      </div>

      <div
        className={cn(
          "flex items-center gap-3 rounded-xl border border-border bg-surface p-4 shadow-card",
        )}
      >
        {isLoading && (
          <>
            <Spinner size={18} />
            <span className="text-sm text-muted">Checking API connection…</span>
          </>
        )}

        {!isLoading && isError && (
          <>
            <XCircle className="h-5 w-5 text-danger" aria-hidden />
            <span className="text-sm">
              Could not reach the server. Start it with{" "}
              <code className="rounded bg-background px-1.5 py-0.5">
                npm run dev
              </code>{" "}
              in <code className="rounded bg-background px-1.5 py-0.5">server/</code>.
            </span>
          </>
        )}

        {!isLoading && !isError && (
          <>
            <CheckCircle2 className="h-5 w-5 text-success" aria-hidden />
            <span className="text-sm">
              API connected — status: {data?.status ?? "ok"}
            </span>
          </>
        )}
      </div>
    </motion.div>
  );
}

export default HomePage;

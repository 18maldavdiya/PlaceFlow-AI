import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Provider as ReduxProvider } from "react-redux";
import { Toaster } from "react-hot-toast";

import { ThemeProvider } from "@/context/ThemeContext";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { queryClient } from "@/lib/queryClient";
import { AppRouter } from "@/routes/AppRouter";
import { store } from "@/store";

function OnlineStatusWatcher() {
  useOnlineStatus();
  return null;
}

/**
 * Composition root: every app-wide provider is wired here, in dependency
 * order (Redux and React Query have no dependency on each other; Theme
 * depends on Redux; the router is innermost since it renders the pages that
 * consume everything above it).
 */
export function App() {
  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <OnlineStatusWatcher />
          <AppRouter />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              className: "text-sm",
            }}
          />
          {import.meta.env.DEV && (
            <ReactQueryDevtools initialIsOpen={false} />
          )}
        </ThemeProvider>
      </QueryClientProvider>
    </ReduxProvider>
  );
}

export default App;

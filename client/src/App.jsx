import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Provider as ReduxProvider, useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";

import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { AppRouter } from "@/routes/AppRouter";
import { store } from "@/store";

// Single TanStack Query client for the app. Server state (anything fetched
// from the API) is owned here, not mirrored into Redux.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      gcTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
    mutations: {
      retry: 0,
    },
  },
});

function OnlineStatusWatcher() {
  useOnlineStatus();
  return null;
}

// Keeps the `dark` class on <html> in sync with Redux's theme state so
// Tailwind's `dark:` variant works — the single place that reads
// `state.app.theme` and applies it to the DOM.
function ThemeEffect() {
  const theme = useSelector((state) => state.app.theme);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.setAttribute("data-theme", theme);
  }, [theme]);

  return null;
}

/**
 * Composition root: every app-wide provider is wired here, in dependency
 * order (Redux and React Query have no dependency on each other; the router
 * is innermost since it renders the pages that consume everything above it).
 */
export function App() {
  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeEffect />
        <OnlineStatusWatcher />
        <AppRouter />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            className: "text-sm",
          }}
        />
        {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
      </QueryClientProvider>
    </ReduxProvider>
  );
}

export default App;

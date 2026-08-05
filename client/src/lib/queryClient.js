import { QueryClient } from "@tanstack/react-query";

/**
 * Single TanStack Query client for the app. Server state (anything fetched
 * from the API) is owned here, not mirrored into Redux — see client/README.md
 * "State & data-fetching conventions".
 */
export const queryClient = new QueryClient({
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

export default queryClient;

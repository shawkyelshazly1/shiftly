import { createRouter } from "@tanstack/react-router";
import { QueryClient } from "@tanstack/react-query";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";
import { setQueryClient } from "./utils/api-client";

// Create a new router instance
export const getRouter = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 6 * 1000,
        retry: 1,
      },
    },
  });

  // Connect axios to queryClient
  setQueryClient(queryClient);

  const router = createRouter({
    routeTree,
    context: { queryClient },
    defaultPreload: "intent",
    // defaultErrorComponent: DefaultCatchBoundary,
    // defaultNotFoundComponent: () => <NotFound />,

    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });

  setupRouterSsrQueryIntegration({
    router,
    queryClient,
  });

  return router;
};

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}

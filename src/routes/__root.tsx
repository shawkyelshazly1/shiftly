/// <reference types="vite/client" />

import type { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
  useMatchRoute,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Toaster } from "sonner";

import { Authsession, getSessionFn } from "@/lib/auth.server";
import { ThemeProvider } from "@/contexts/theme-context";
import {
  SidebarProvider,
  AppSidebar,
  MobileSidebar,
  MobileSidebarTrigger,
} from "@/components/sidebar";
import appCss from "../styles/app.css?url";

interface RouterContext {
  auth?: Authsession;
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Shiftly" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
      },
      { rel: "stylesheet", href: appCss },
    ],
  }),
  component: RootComponent,
  shellComponent: RootDocument,
  beforeLoad: async ({ context }) => {
    const auth = await context.queryClient.ensureQueryData({
      queryKey: ["session"],
      queryFn: () => getSessionFn(),
      staleTime: 5 * 60 * 1000,
    });
    return { auth };
  },
});

function RootComponent() {
  return (
    <div className="flex-1 flex flex-col w-full">
      <Outlet />
    </div>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  const matchRoute = useMatchRoute();
  const isAuthRoute =
    matchRoute({ to: "/login" }) ||
    matchRoute({ to: "/reset-password" }) ||
    matchRoute({ to: "/forgot-password" });

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <ThemeProvider>
          {isAuthRoute ? (
            <div className="min-h-screen flex flex-col">
              {children}
              <Toaster />
            </div>
          ) : (
            <SidebarProvider>
              <div className="flex min-h-screen">
                <AppSidebar />
                <MobileSidebar />
                <div className="flex-1 flex flex-col overflow-auto">
                  {/* Mobile Header */}
                  <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b bg-background px-4 md:hidden">
                    <MobileSidebarTrigger />
                    <span className="text-lg font-semibold">Shiftly</span>
                  </header>
                  <main className="flex-1 flex flex-col">{children}</main>
                </div>
              </div>
              <Toaster />
            </SidebarProvider>
          )}
        </ThemeProvider>
        <TanStackRouterDevtools position="bottom-right" />
        <ReactQueryDevtools buttonPosition="bottom-left" />
        <Scripts />
      </body>
    </html>
  );
}

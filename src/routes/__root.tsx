/// <reference types="vite/client" />

import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
  redirect,
  useMatchRoute,
} from "@tanstack/react-router";
import {
  TanStackRouterDevtools,
  TanStackRouterDevtoolsPanel,
} from "@tanstack/react-router-devtools";
import { Toaster } from "sonner";

import { Authsession, getSessionFn } from "@/lib/auth.server";
import appCss from "../styles/app.css?url";
import Navbar from "@/components/navbar";

interface RouterContext {
  auth?: Authsession;
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Shiftly",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
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
  return <Outlet />;
}

function RootDocument({ children }: { children: React.ReactNode }) {
  const matchRoute = useMatchRoute();

  const matchedAuthRoute =
    matchRoute({ to: "/login" }) || matchRoute({ to: "/reset-password" });
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {!matchedAuthRoute && <Navbar />}

        {children}
        <Toaster />
        {/* <TanStackDevtools
          config={{
            position: "bottom-right",
          }}
          plugins={[
            {
              name: "Tanstack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        /> */}
        <TanStackRouterDevtools position="bottom-right" />
        <ReactQueryDevtools buttonPosition="bottom-left" />
        <Scripts />
      </body>
    </html>
  );
}

import { Authsession, getSessionFn } from "@/lib/auth.server";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated")({
  component: AuthenticatedLayout,
  beforeLoad: async ({ context, location }) => {
    if (!context.auth?.isAuthenticated) {
      throw redirect({ to: "/login", search: { redirect: location.href } });
    }
    return { auth: context.auth };
  },
});

function AuthenticatedLayout() {
  return <Outlet />;
}

export type AuthenticatedRouteContext = {
  auth: Authsession;
};

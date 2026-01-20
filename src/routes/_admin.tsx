import { Authsession, getSessionFn } from "@/lib/auth.server";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_admin")({
  component: AdminLayout,
  beforeLoad: async ({ location }) => {
    const auth = await getSessionFn();

    if (!auth.isAuthenticated) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }
    return { auth };
  },
});

function AdminLayout() {
  return <Outlet />;
}

export type AdminRouteContext = {
  auth: Authsession;
};

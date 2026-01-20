import { Authsession, getSessionFn } from "@/lib/auth.server";
import { currentUserPermissionQueryOptions } from "@/utils/auth.permissions.query";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_admin")({
  component: AdminLayout,
  beforeLoad: async ({ context, location }) => {
    const auth = context.auth;

    if (!auth?.isAuthenticated) {
      throw redirect({ to: "/login", search: { redirect: location.href } });
    }

    //check admin permission
    const { permissions } = await context.queryClient.ensureQueryData(
      currentUserPermissionQueryOptions()
    );
    // if (!permissions.includes("admin:access")) {
    //   throw redirect({ to: "/" });
    // }

    return { auth };
  },
});

function AdminLayout() {
  return <Outlet />;
}

export type AdminRouteContext = {
  auth: Authsession;
};

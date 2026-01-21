import { PERMISSIONS } from "@/constants/permissions";
import { Authsession } from "@/lib/auth.server";
import { currentUserPermissionQueryOptions } from "@/utils/auth.permissions.query";
import { requireAnyPermission } from "@/utils/routes.utils";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/_manage")({
  component: ManageLayout,
  beforeLoad: async ({ context, location }) => {
    if (!context.auth?.isAuthenticated) {
      throw redirect({ to: "/login", search: { redirect: location.href } });
    }

    //check manage permission
    const { permissions } = await context.queryClient.ensureQueryData(
      currentUserPermissionQueryOptions()
    );
    requireAnyPermission(
      [PERMISSIONS.USERS_ALL, PERMISSIONS.TEAMS_ALL, PERMISSIONS.SCHEDULES_ALL],
      {
        permissions,
      }
    );

    return { auth: context.auth };
  },
});

function ManageLayout() {
  return <Outlet />;
}

export type ManageRouteContext = {
  auth: Authsession;
};

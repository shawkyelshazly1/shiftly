import Navbar from "@/components/navbar";
import { PERMISSIONS } from "@/constants/permissions";
import { Authsession } from "@/lib/auth.server";
import { currentUserPermissionQueryOptions } from "@/utils/auth.permissions.query";
import { requireAnyPermission } from "@/utils/routes.utils";
import {
  createFileRoute,
  Link,
  Outlet,
  redirect,
} from "@tanstack/react-router";

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
    requireAnyPermission([PERMISSIONS.ROLES_ALL, PERMISSIONS.SETTINGS_ALL], {
      permissions,
    });

    return { auth };
  },
});

function AdminLayout() {
  return (
    <div className="flex-1 flex flex-col w-full">
      <main className="p-4 flex-1 flex flex-col w-full">
        <Outlet />
      </main>
    </div>
  );
}

export type AdminRouteContext = {
  auth: Authsession;
};

import { PERMISSIONS } from "@/constants/permissions";
import { currentUserPermissionQueryOptions } from "@/utils/auth.permissions.query";
import { requireAnyPermission } from "@/utils/routes.utils";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/settings")({
  component: SettingsLayout,
  beforeLoad: async ({ context }) => {
    const { permissions } = await context.queryClient.ensureQueryData(
      currentUserPermissionQueryOptions()
    );

    requireAnyPermission(
      [
        PERMISSIONS.USERS_ALL,
        PERMISSIONS.TEAMS_ALL,
        PERMISSIONS.ROLES_ALL,
        PERMISSIONS.SETTINGS_ALL,
      ],
      { permissions }
    );

    return { auth: context.auth };
  },
});

function SettingsLayout() {
  return (
    <div className="flex-1 flex flex-col p-4 sm:p-6">
      <Outlet />
    </div>
  );
}

import { PERMISSIONS } from "@/constants/permissions";
import { currentUserPermissionQueryOptions } from "@/utils/auth.permissions.query";
import { requireAnyPermission } from "@/utils/routes.utils";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_authenticated/_manage/manage/schedule/"
)({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    //check manage permission
    const { permissions } = await context.queryClient.ensureQueryData(
      currentUserPermissionQueryOptions()
    );
    requireAnyPermission([PERMISSIONS.SCHEDULES_ALL], {
      permissions,
    });

    return { auth: context.auth };
  },
});

function RouteComponent() {
  return <div>Hello "/_authenticated/_manage/manage/schedule/"!</div>;
}

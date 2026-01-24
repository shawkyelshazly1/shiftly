import { createFileRoute } from "@tanstack/react-router";
import { Settings } from "lucide-react";
import { PERMISSIONS } from "@/constants/permissions";
import { currentUserPermissionQueryOptions } from "@/utils/auth.permissions.query";
import { requireAnyPermission } from "@/utils/routes.utils";

export const Route = createFileRoute("/_authenticated/settings/general/")({
  component: GeneralSettingsPage,
  beforeLoad: async ({ context }) => {
    const { permissions } = await context.queryClient.ensureQueryData(
      currentUserPermissionQueryOptions()
    );
    requireAnyPermission([PERMISSIONS.SETTINGS_ALL], { permissions });
    return { auth: context.auth };
  },
});

function GeneralSettingsPage() {
  return (
    <div className="flex-1 flex flex-col gap-6">
      <div>
        <h1 className="font-semibold text-2xl">General Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Configure application-wide settings
        </p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div className="rounded-full bg-muted p-4 mb-4">
          <Settings className="h-8 w-8 text-muted-foreground" />
        </div>
        <h2 className="text-lg font-medium">General settings coming soon</h2>
        <p className="text-muted-foreground text-sm mt-1 max-w-md">
          Configure organization settings, branding, notifications, and more.
        </p>
      </div>
    </div>
  );
}

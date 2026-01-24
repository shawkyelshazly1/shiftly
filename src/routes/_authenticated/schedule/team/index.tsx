import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PERMISSIONS } from "@/constants/permissions";
import { currentUserPermissionQueryOptions } from "@/utils/auth.permissions.query";
import { requireAnyPermission } from "@/utils/routes.utils";

export const Route = createFileRoute("/_authenticated/schedule/team/")({
  component: TeamSchedulePage,
  beforeLoad: async ({ context }) => {
    const { permissions } = await context.queryClient.ensureQueryData(
      currentUserPermissionQueryOptions()
    );
    requireAnyPermission([PERMISSIONS.SWAPS_APPROVE], { permissions });
    return { auth: context.auth };
  },
});

function TeamSchedulePage() {
  return (
    <div className="flex-1 flex flex-col p-6 gap-6">
      <div>
        <h1 className="font-semibold text-2xl">Team Schedule</h1>
        <p className="text-muted-foreground text-sm mt-1">
          View and manage your team's shifts
        </p>
      </div>

      <Card className="flex-1">
        <CardHeader>
          <CardTitle className="text-lg">Team Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-96 text-center">
            <div className="rounded-full bg-muted p-4 mb-4">
              <CalendarDays className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-medium">Team schedule view coming soon</h2>
            <p className="text-muted-foreground text-sm mt-1 max-w-md">
              View your team's schedule, approve shift swaps, and manage coverage.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

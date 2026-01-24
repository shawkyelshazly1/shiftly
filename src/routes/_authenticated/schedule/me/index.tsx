import { createFileRoute } from "@tanstack/react-router";
import { Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/_authenticated/schedule/me/")({
  component: MySchedulePage,
});

function MySchedulePage() {
  return (
    <div className="flex-1 flex flex-col p-6 gap-6">
      <div>
        <h1 className="font-semibold text-2xl">My Schedule</h1>
        <p className="text-muted-foreground text-sm mt-1">
          View and manage your upcoming shifts
        </p>
      </div>

      <Card className="flex-1">
        <CardHeader>
          <CardTitle className="text-lg">Schedule Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-96 text-center">
            <div className="rounded-full bg-muted p-4 mb-4">
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-medium">Schedule view coming soon</h2>
            <p className="text-muted-foreground text-sm mt-1 max-w-md">
              View your assigned shifts, request time off, and manage your availability.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

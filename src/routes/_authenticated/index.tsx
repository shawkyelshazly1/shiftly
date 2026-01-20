import LogoutButton from "@/components/logout-button";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <LogoutButton />
    </div>
  );
}

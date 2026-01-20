import LogoutButton from "@/components/logout-button";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_admin/admin/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { auth } = Route.useRouteContext();

  console.log(auth);

  return (
    <div>
      <LogoutButton />
    </div>
  );
}

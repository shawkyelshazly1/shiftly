import LogoutButton from "@/components/logout-button";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_admin/admin/roles")({
  component: RouteComponent,
});

function RouteComponent() {
  const { auth } = Route.useRouteContext();

  return <div>Roles page</div>;
}

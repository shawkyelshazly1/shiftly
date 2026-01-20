import LogoutButton from "@/components/logout-button";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_admin/admin/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { auth } = Route.useRouteContext();

  return (
    <div>
      <Link to="/">main</Link>
      <Link to="/admin/test">test</Link>
      <LogoutButton />
    </div>
  );
}

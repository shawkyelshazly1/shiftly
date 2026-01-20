import LogoutButton from "@/components/logout-button";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <Link to="/admin">admin</Link>
      <LogoutButton />
    </div>
  );
}

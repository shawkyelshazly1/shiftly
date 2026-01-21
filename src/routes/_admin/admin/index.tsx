import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_admin/admin/")({
  // auto redirect to /admin/roles
  beforeLoad: () => {
    throw redirect({ to: "/admin/roles" });
  },
});

import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/_manage/manage/")({
  beforeLoad: () => {
    throw redirect({ to: "/manage/users" });
  },
});

import { createFileRoute } from "@tanstack/react-router";
import ResetPasswordForm from "../-components/reset-password-form";

type ResetPasswordSearchParams = {
  token?: string;
};

export const Route = createFileRoute("/_auth/reset-password/")({
  validateSearch: (
    search: Record<string, unknown>
  ): ResetPasswordSearchParams => {
    return {
      token: typeof search.token === "string" ? search.token : undefined,
    };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { token } = Route.useSearch();

  return <ResetPasswordForm token={token} />;
}

import { createFileRoute } from "@tanstack/react-router";
import LoginForm from "../-components/login-form";

type LoginSearchParams = {
  redirect?: string;
};

export const Route = createFileRoute("/_auth/login/")({
  validateSearch: (search: Record<string, unknown>): LoginSearchParams => {
    return {
      redirect: search.redirect as string | undefined,
    };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { redirect } = Route.useSearch();

  return (
    <>
      <LoginForm redirectTo={redirect} />
    </>
  );
}

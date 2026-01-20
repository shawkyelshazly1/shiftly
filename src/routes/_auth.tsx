import { getSessionFn } from "@/lib/auth.server";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import Logo from "@/assets/logo.horizontal.svg?react";

type AuthSearch = {
  redirect?: string;
};

export const Route = createFileRoute("/_auth")({
  validateSearch: (search: Record<string, string>): AuthSearch => {
    return {
      redirect: search.redirect || "/",
    };
  },
  component: Authlayout,

  beforeLoad: async ({ search }) => {
    const auth = await getSessionFn();

    if (auth.isAuthenticated) {
      throw redirect({
        to: search?.redirect,
      });
    }
    return { auth };
  },
});

function Authlayout() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center gap-5">
      <Logo color="black" />
      <Outlet />
    </div>
  );
}

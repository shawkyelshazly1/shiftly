import { getSessionFn } from "@/lib/auth.server";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import LogoIcon from "@/assets/logo-icon.svg?react";
import LogoText from "@/assets/logo-text.svg?react";

type AuthSearch = {
  redirect?: string;
};

export const Route = createFileRoute("/_auth")({
  validateSearch: (search: Record<string, string>): AuthSearch => {
    return {
      redirect: search.redirect || "/",
    };
  },
  component: AuthLayout,
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

function AuthLayout() {
  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row">
      {/* Brand Panel - Left Side (Hidden on mobile, visible on lg+) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-primary via-primary to-primary/80">
        {/* Decorative floating shapes */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Circle 1 - Large, top right */}
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/10 animate-float-slow" />

          {/* Circle 2 - Medium, bottom left */}
          <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-white/5 animate-float-medium" />

          {/* Square 1 - Rotated, center right */}
          <div className="absolute top-1/3 right-20 w-24 h-24 rounded-lg bg-white/10 rotate-45 animate-float-fast" />

          {/* Square 2 - Small, top left */}
          <div className="absolute top-32 left-20 w-16 h-16 rounded-md bg-white/5 rotate-12 animate-float-medium" />

          {/* Circle 3 - Small, center */}
          <div className="absolute top-1/2 left-1/3 w-20 h-20 rounded-full bg-white/10 animate-float-slow" />

          {/* Square 3 - Bottom right */}
          <div className="absolute bottom-40 right-32 w-12 h-12 rounded-md bg-white/15 -rotate-12 animate-float-fast" />
        </div>

        {/* Brand Content */}
        <div className="relative z-10 flex flex-col justify-center items-start px-12 xl:px-20 animate-fade-in">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <LogoIcon className="h-12 w-12 text-white" />
            <LogoText className="h-8 text-white" />
          </div>

          {/* Tagline */}
          <h1 className="text-3xl xl:text-4xl font-semibold text-white leading-tight mb-4">
            Streamline Your Workforce Management
          </h1>
          <p className="text-lg text-white/80 max-w-md leading-relaxed">
            Schedule shifts, manage teams, and empower your employees with a modern platform built for the way you work.
          </p>

          {/* Feature highlights */}
          <div className="mt-12 space-y-4">
            <div className="flex items-center gap-3 text-white/90">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-sm font-medium">Real-time schedule updates</span>
            </div>
            <div className="flex items-center gap-3 text-white/90">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-sm font-medium">Team collaboration tools</span>
            </div>
            <div className="flex items-center gap-3 text-white/90">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-sm font-medium">Mobile-first experience</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Brand Header (Visible on < lg screens) */}
      <div className="flex lg:hidden bg-gradient-to-r from-primary to-primary/90 px-6 py-8">
        <div className="flex items-center gap-3 animate-fade-in">
          <LogoIcon className="h-10 w-10 text-white" />
          <LogoText className="h-6 text-white" />
        </div>
      </div>

      {/* Form Panel - Right Side */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-8 lg:p-12 bg-background">
        <div className="w-full max-w-md animate-fade-in-up">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/")({
  component: HomePage,
});

function HomePage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6">
      <h1 className="font-semibold text-2xl text-muted-foreground">
        Welcome to Shiftly
      </h1>
    </div>
  );
}

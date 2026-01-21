import { authClient } from "@/lib/auth.client";
import { Button } from "./ui/button";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

export default function LogoutButton({
  classStyles,
}: {
  classStyles: React.ComponentProps<typeof Button>["className"];
}) {
  const queryClient = useQueryClient();
  const location = useLocation();

  const navigate = useNavigate();
  return (
    <Button
      className={cn(classStyles)}
      onClick={() => {
        authClient.signOut({
          fetchOptions: {
            onSuccess: () => {
              queryClient.removeQueries({ queryKey: ["user-permissions"] });

              navigate({
                to: "/login",
                search: {
                  redirect: location.pathname,
                },
              });
            },
            onError: ({ error }) => {
              toast.error(error.message);
            },
          },
        });
      }}
    >
      Logout
    </Button>
  );
}

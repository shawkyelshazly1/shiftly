import { authClient } from "@/lib/auth.client";
import { Button } from "./ui/button";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

export default function LogoutButton() {
  const location = useLocation();

  const navigate = useNavigate();
  return (
    <Button
      onClick={() => {
        authClient.signOut({
          fetchOptions: {
            onSuccess: () => {
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

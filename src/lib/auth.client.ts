import { env } from "@/env";
import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: env.VITE_SERVER_URL,
  redirectTo: "/",
  plugins: [
    inferAdditionalFields({
      user: {
        roleId: {
          input: false,
          type: "string",
        },
      },
    }),
  ],
});

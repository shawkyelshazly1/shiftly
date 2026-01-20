import { createServerFn } from "@tanstack/react-start";
import { authClient } from "./auth.client";
import { getRequest } from "@tanstack/react-start/server";

export type User = typeof authClient.$Infer.Session.user;
export type Session = typeof authClient.$Infer.Session.session;

export type Authsession = {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
};

// server function to get current serssion
export const getSessionFn = createServerFn({ method: "GET" }).handler(
  async () => {
    const request = getRequest();

    const { data, error } = await authClient.getSession({
      fetchOptions: {
        headers: request.headers,
      },
    });

    if (error || !data) {
      return {
        user: null,
        session: null,
        isAuthenticated: false,
      } satisfies Authsession;
    }

    return {
      user: data.user,
      session: data.session,
      isAuthenticated: true,
    };
  }
);

// Server function to get user with role
// export const getUserWithRoleFn = createServerFn({ method: "GET" }).handler(
//   async () => {
//     const request = getRequest();

//     const { data, error } = await authClient.getSession({
//       fetchOptions: {
//         headers: request.headers,
//       },
//     });

//     if (error || !data) {
//       return null;
//     }

//     return {
//       ...data.user,
//       role: (data.user.role as Role) || "user",
//     };
//   }
// );

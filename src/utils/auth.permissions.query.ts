import { createServerFn } from "@tanstack/react-start";
import { apiClient } from "./api-client";
import { queryOptions } from "@tanstack/react-query";
import { getRequest } from "@tanstack/react-start/server";

export type PermissionsResponse = {
  permissions: string[];
  roleId: string | null;
};

/**
 * Server function to get current user's permissions
 * Returns empty permissions on error (graceful degradation for UI)
 */
export const getCurrentUserPermissions = createServerFn({
  method: "GET",
}).handler(async (): Promise<PermissionsResponse> => {
  try {
    const request = getRequest();

    const response = await apiClient.get<PermissionsResponse>(
      "/v1/permissions/me",
      {
        headers: {
          cookie: request.headers.get("cookie") || "",
        },
      }
    );

    return response.data;
  } catch (error) {
    // Return empty permissions on error (user not authenticated)
    return { permissions: [], roleId: null };
  }
});

export const currentUserPermissionQueryOptions = () =>
  queryOptions({
    queryKey: ["user-permissions"],
    queryFn: () => getCurrentUserPermissions(),
    staleTime: 5 * 60 * 1000,
  });

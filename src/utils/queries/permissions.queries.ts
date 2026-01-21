import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { apiClient } from "../api-client";
import { Permission } from "@/types/permission.types";
import { queryOptions } from "@tanstack/react-query";

/**
 * server function to get all permissions
 */
export const getAllPermissions = createServerFn({ method: "GET" }).handler(
  async () => {
    try {
      const request = getRequest();

      const response = await apiClient.get<Permission[]>("/v1/permissions", {
        headers: {
          cookie: request.headers.get("cookie") || "",
        },
      });

      return response.data;
    } catch (error) {
      console.error("Failed to fetch permissions: ", error);
      throw new Error("Unable to fetch permissions at the moment.");
    }
  }
);

export const permissionsQueryOptions = () =>
  queryOptions({
    queryKey: ["permissions"],
    queryFn: () => getAllPermissions(),
    staleTime: 10 * 6 * 1000, //10 mins
  });

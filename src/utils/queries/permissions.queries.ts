import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { apiClient } from "../api-client";
import { Permission } from "@/types/permission.types";
import { queryOptions } from "@tanstack/react-query";
import { parseAxiosError } from "../api-error.utils";

/**
 * Server function to get all permissions
 */
export const getAllPermissions = createServerFn({ method: "GET" }).handler(
  async (): Promise<Permission[]> => {
    try {
      const request = getRequest();

      const response = await apiClient.get<Permission[]>("/v1/permissions", {
        headers: {
          cookie: request.headers.get("cookie") || "",
        },
      });

      return response.data;
    } catch (error) {
      throw parseAxiosError(error);
    }
  }
);

/**
 * Query options for React Query
 */
export const permissionsQueryOptions = () =>
  queryOptions({
    queryKey: ["permissions"],
    queryFn: () => getAllPermissions(),
    staleTime: 10 * 60 * 1000,
  });

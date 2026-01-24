import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { apiClient } from "../api-client";
import { CreateRoleInput, Role, UpdateRoleInput } from "@/types/role.types";
import { PaginatedResponse, PaginationParams } from "@/types/pagination.types";
import { queryOptions } from "@tanstack/react-query";
import { createRoleSchema } from "../schemas";
import { parseAxiosError } from "../api-error.utils";
import z from "zod";

/**
 * Server function to get all roles
 */
export const getAllRoles = createServerFn({ method: "GET" }).handler(
  async (): Promise<Role[]> => {
    try {
      const request = getRequest();

      const response = await apiClient.get<Role[]>("/v1/roles", {
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
 * Server function to get paginated roles
 */
export const getRolesPaginated = createServerFn({ method: "GET" })
  .inputValidator((data: PaginationParams) => data)
  .handler(async ({ data }): Promise<PaginatedResponse<Role>> => {
    try {
      const request = getRequest();
      const params = new URLSearchParams();

      params.set("page", String(data.page ?? 1));
      params.set("pageSize", String(data.pageSize ?? 10));
      if (data.search) params.set("search", data.search);
      if (data.sortBy) params.set("sortBy", data.sortBy);
      if (data.sortOrder) params.set("sortOrder", data.sortOrder);

      const response = await apiClient.get<PaginatedResponse<Role>>(
        `/v1/roles?${params.toString()}`,
        {
          headers: {
            cookie: request.headers.get("cookie") || "",
          },
        }
      );

      return response.data;
    } catch (error) {
      throw parseAxiosError(error);
    }
  });

/**
 * Server function to get single role by id
 */
export const getRoleById = createServerFn({ method: "GET" })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }): Promise<Role> => {
    try {
      const request = getRequest();

      const response = await apiClient.get<Role>(`/v1/roles/${data.id}`, {
        headers: {
          cookie: request.headers.get("cookie") || "",
        },
      });

      return response.data;
    } catch (error) {
      throw parseAxiosError(error);
    }
  });

/**
 * Server function to create a new role
 */
export const createRole = createServerFn({ method: "POST" })
  .inputValidator((data: CreateRoleInput) => createRoleSchema.parse(data))
  .handler(async ({ data }): Promise<Role> => {
    try {
      const request = getRequest();

      const response = await apiClient.post<Role>("/v1/roles", data, {
        headers: {
          cookie: request.headers.get("cookie") || "",
        },
      });

      return response.data;
    } catch (error) {
      throw parseAxiosError(error);
    }
  });

/**
 * Server function to update role
 */
export const updateRole = createServerFn({ method: "POST" })
  .inputValidator((data: { id: string; roleData: UpdateRoleInput }) => ({
    id: z.uuid().parse(data.id),
    roleData: createRoleSchema.partial().parse(data.roleData),
  }))
  .handler(async ({ data }): Promise<Role> => {
    try {
      const request = getRequest();

      const response = await apiClient.patch<Role>(
        `/v1/roles/${data.id}`,
        data.roleData,
        {
          headers: {
            cookie: request.headers.get("cookie") || "",
          },
        }
      );

      return response.data;
    } catch (error) {
      throw parseAxiosError(error);
    }
  });

/**
 * Server function to delete role
 */
export const deleteRoleById = createServerFn({ method: "POST" })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }): Promise<void> => {
    try {
      const request = getRequest();

      await apiClient.delete(`/v1/roles/${data.id}`, {
        headers: {
          cookie: request.headers.get("cookie") || "",
        },
      });
    } catch (error) {
      throw parseAxiosError(error);
    }
  });

/**
 * Query options for React Query
 */
export const rolesQueryOptions = () =>
  queryOptions({
    queryKey: ["roles"],
    queryFn: () => getAllRoles(),
    staleTime: 5 * 60 * 1000,
  });

export const rolesPaginatedQueryOptions = (params: PaginationParams) =>
  queryOptions({
    queryKey: ["roles", "paginated", params],
    queryFn: () => getRolesPaginated({ data: params }),
    staleTime: 5 * 60 * 1000,
  });

export const roleQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ["roles", id],
    queryFn: () => getRoleById({ data: { id } }),
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
  });

import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { apiClient } from "../api-client";
import { User, UserWithPermissions, UpdateUserInput } from "@/types/user.types";
import { PaginatedResponse, PaginationParams } from "@/types/pagination.types";
import { queryOptions } from "@tanstack/react-query";
import { parseAxiosError } from "../api-error.utils";

/**
 * Server function to get user counts (global totals)
 */
export const getUsersCount = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ total: number; verified: number }> => {
    try {
      const request = getRequest();

      const response = await apiClient.get<{ total: number; verified: number }>("/v1/users/count", {
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
 * Server function to get all users
 */
export const getAllUsers = createServerFn({ method: "GET" }).handler(
  async (): Promise<User[]> => {
    try {
      const request = getRequest();

      const response = await apiClient.get<User[]>("/v1/users", {
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
 * Server function to get paginated users
 */
export const getUsersPaginated = createServerFn({ method: "GET" })
  .inputValidator((data: PaginationParams) => data)
  .handler(async ({ data }): Promise<PaginatedResponse<User>> => {
    try {
      const request = getRequest();
      const params = new URLSearchParams();

      params.set("page", String(data.page ?? 1));
      params.set("pageSize", String(data.pageSize ?? 10));
      if (data.search) params.set("search", data.search);
      if (data.sortBy) params.set("sortBy", data.sortBy);
      if (data.sortOrder) params.set("sortOrder", data.sortOrder);
      if (data.roleId) params.set("roleId", data.roleId);
      if (data.teamId) params.set("teamId", data.teamId);

      const response = await apiClient.get<PaginatedResponse<User>>(
        `/v1/users?${params.toString()}`,
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
 * Server function to get single user by id
 */
export const getUserById = createServerFn({ method: "GET" })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }): Promise<UserWithPermissions> => {
    try {
      const request = getRequest();

      const response = await apiClient.get<UserWithPermissions>(
        `/v1/users/${data.id}`,
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
 * Server function to update user
 */
export const updateUser = createServerFn({ method: "POST" })
  .inputValidator((data: { id: string; userData: UpdateUserInput }) => data)
  .handler(async ({ data }): Promise<UserWithPermissions> => {
    try {
      const request = getRequest();

      const response = await apiClient.patch<UserWithPermissions>(
        `/v1/users/${data.id}`,
        data.userData,
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
 * Server function to delete user
 */
export const deleteUserById = createServerFn({ method: "POST" })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }): Promise<void> => {
    try {
      const request = getRequest();

      await apiClient.delete(`/v1/users/${data.id}`, {
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
export const usersQueryOptions = () =>
  queryOptions({
    queryKey: ["users"],
    queryFn: () => getAllUsers(),
    staleTime: 5 * 60 * 1000,
  });

export const usersPaginatedQueryOptions = (params: PaginationParams) =>
  queryOptions({
    queryKey: ["users", "paginated", params],
    queryFn: () => getUsersPaginated({ data: params }),
    staleTime: 5 * 60 * 1000,
  });

export const userQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ["users", id],
    queryFn: () => getUserById({ data: { id } }),
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
  });

export const usersCountQueryOptions = () =>
  queryOptions({
    queryKey: ["users", "count"],
    queryFn: () => getUsersCount(),
    staleTime: 5 * 60 * 1000,
  });

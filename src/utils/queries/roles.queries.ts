import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { apiClient } from "../api-client";
import { CreateRoleInput, Role, UpdateRoleInput } from "@/types/role.types";
import { queryOptions } from "@tanstack/react-query";
import { createRoleSchema } from "../schemas";
import z from "zod";

/**
 * Server function to get all roles
 */
export const getAllRoles = createServerFn({ method: "GET" }).handler(
  async () => {
    try {
      const request = getRequest();

      const response = await apiClient.get<Role[]>("/v1/roles", {
        headers: {
          cookie: request.headers.get("cookie") || "",
        },
      });

      return response.data;
    } catch (error) {
      console.error("Failed to fetch roles: ", error);
      throw new Error("Unable to fetch roles at the moment.");
    }
  }
);

/**
 * server function to get single role by id
 */
export const getRoleById = createServerFn({ method: "GET" })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    try {
      const request = getRequest();

      const response = await apiClient.get<Role>(`/v1/roles/${data.id}`, {
        headers: {
          cookie: request.headers.get("cookie") || "",
        },
      });

      return response.data;
    } catch (error) {
      console.error("Failed to fetch role by id: ", error);
      throw new Error("Unable to fetch role at the moment.");
    }
  });

/**
 * server function to create a new role
 */

export const createRole = createServerFn({ method: "POST" })
  .inputValidator((data: CreateRoleInput) => createRoleSchema.parse(data))
  .handler(async ({ data }) => {
    try {
      const request = getRequest();

      const response = await apiClient.post<Role>("/v1/roles", data, {
        headers: {
          cookie: request.headers.get("cookie") || "",
        },
      });

      return response.data;
    } catch (error) {
      console.error("Failed to create role: ", error);
      throw new Error("Unable to create new role at the moment.");
    }
  });

/**
 * server function to update role
 */
export const updateRole = createServerFn({ method: "POST" })
  .inputValidator((data: { id: string; roleData: UpdateRoleInput }) => ({
    id: z.uuid().parse(data.id),
    roleData: createRoleSchema.partial().parse(data.roleData),
  }))
  .handler(async ({ data }) => {
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
      console.error("failed to update role: ", error);
      throw new Error("Unable to update role at the moment.");
    }
  });

/**
 * server function to delete role
 */
export const deleteRoleById = createServerFn({ method: "POST" })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    try {
      const request = getRequest();

      await apiClient.delete(`/v1/roles/${data.id}`, {
        headers: {
          cookie: request.headers.get("cookie") || "",
        },
      });
    } catch (error) {
      console.error("failed to delete role: ", error);
      throw new Error("Unable to delete role at the moment.");
    }
  });

/**
 * query options for react query
 */

export const rolesQueryOptions = () =>
  queryOptions({
    queryKey: ["roles"],
    queryFn: () => getAllRoles(),
    staleTime: 5 * 60 * 1000, // 5 mins
  });

export const roleQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ["roles", id],
    queryFn: () => getRoleById({ data: { id } }),
    staleTime: 5 * 6 * 1000, // 5 mins
    enabled: !!id,
  });

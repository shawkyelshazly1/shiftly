import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { apiClient } from "../api-client";
import { User, UserWithPermissions, UpdateUserInput } from "@/types/user.types";
import { queryOptions } from "@tanstack/react-query";

/**
 * Server function to get all users
 */
export const getAllUsers = createServerFn({ method: "GET" }).handler(
  async () => {
    try {
      const request = getRequest();

      const response = await apiClient.get<User[]>("/v1/users", {
        headers: {
          cookie: request.headers.get("cookie") || "",
        },
      });

      return response.data;
    } catch (error) {
      console.error("Failed to fetch users: ", error);
      throw new Error("Unable to fetch users at the moment.");
    }
  }
);

/**
 * Server function to get single user by id
 */
export const getUserById = createServerFn({ method: "GET" })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => {
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
      console.error("Failed to fetch user by id: ", error);
      throw new Error("Unable to fetch user at the moment.");
    }
  });

/**
 * Server function to update user
 */
export const updateUser = createServerFn({ method: "POST" })
  .inputValidator((data: { id: string; userData: UpdateUserInput }) => data)
  .handler(async ({ data }) => {
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
      console.error("Failed to update user: ", error);
      throw new Error("Unable to update user at the moment.");
    }
  });

/**
 * Server function to delete user
 */
export const deleteUserById = createServerFn({ method: "POST" })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    try {
      const request = getRequest();

      await apiClient.delete(`/v1/users/${data.id}`, {
        headers: {
          cookie: request.headers.get("cookie") || "",
        },
      });
    } catch (error) {
      console.error("Failed to delete user: ", error);
      throw new Error("Unable to delete user at the moment.");
    }
  });

/**
 * Query options for react query
 */
export const usersQueryOptions = () =>
  queryOptions({
    queryKey: ["users"],
    queryFn: () => getAllUsers(),
    staleTime: 5 * 60 * 1000, // 5 mins
  });

export const userQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ["users", id],
    queryFn: () => getUserById({ data: { id } }),
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
  });

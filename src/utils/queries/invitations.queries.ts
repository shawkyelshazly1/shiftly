import { createServerFn } from "@tanstack/react-start";
import { parseAxiosError } from "../api-error.utils";
import { getRequest } from "@tanstack/react-start/server";
import { apiClient } from "../api-client";
import { Invitation } from "@/types/invitation.types";
import { PaginatedResponse, PaginationParams } from "@/types/pagination.types";
import { queryOptions } from "@tanstack/react-query";

/**
 * server function to get all invitations
 */
export const getAllInvitations = createServerFn({ method: "GET" }).handler(
  async () => {
    try {
      const request = getRequest();
      const response = await apiClient.get<Invitation[]>("/v1/invitations", {
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
 * Server function to get paginated invitations
 */
export const getInvitationsPaginated = createServerFn({ method: "GET" })
  .inputValidator((data: PaginationParams) => data)
  .handler(async ({ data }): Promise<PaginatedResponse<Invitation>> => {
    try {
      const request = getRequest();
      const params = new URLSearchParams();

      params.set("page", String(data.page ?? 1));
      params.set("pageSize", String(data.pageSize ?? 10));
      if (data.search) params.set("search", data.search);
      if (data.sortBy) params.set("sortBy", data.sortBy);
      if (data.sortOrder) params.set("sortOrder", data.sortOrder);

      const response = await apiClient.get<PaginatedResponse<Invitation>>(
        `/v1/invitations?${params.toString()}`,
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
 * server function to accept token
 */
export const acceptInvitation = createServerFn({ method: "POST" })
  .inputValidator((data: { token: string }) => data)
  .handler(async ({ data }) => {
    try {
      const request = getRequest();
      await apiClient.post(`/v1/invitations/accept?token=${data.token}`, {
        headers: {
          cookie: request.headers.get("cookie") || "",
        },
      });
    } catch (error) {
      throw parseAxiosError(error);
    }
  });

/**
 * server function to resend invitation
 */

export const resendInvitation = createServerFn({ method: "POST" })
  .inputValidator((data: { userId: string }) => data)
  .handler(async ({ data }) => {
    try {
      const request = getRequest();
      await apiClient.post(`/v1/invitations/${data.userId}/resend`, null, {
        headers: {
          cookie: request.headers.get("cookie") || "",
        },
      });
    } catch (error) {
      throw parseAxiosError(error);
    }
  });

/**
 * server function to cancel invitation
 */
export const cancelInvitation = createServerFn({ method: "POST" })
  .inputValidator((data: { userId: string }) => data)
  .handler(async ({ data }) => {
    try {
      const request = getRequest();
      await apiClient.post(`/v1/invitations/${data.userId}/cancel`, null, {
        headers: {
          cookie: request.headers.get("cookie") || "",
        },
      });
    } catch (error) {
      throw parseAxiosError(error);
    }
  });

/**
 * query options for query client
 */

export const invitationsQueryOptions = () =>
  queryOptions({
    queryKey: ["invitations"],
    queryFn: () => getAllInvitations(),
    staleTime: 5 * 60 * 1000,
  });

export const invitationsPaginatedQueryOptions = (params: PaginationParams) =>
  queryOptions({
    queryKey: ["invitations", "paginated", params],
    queryFn: () => getInvitationsPaginated({ data: params }),
    staleTime: 5 * 60 * 1000,
  });

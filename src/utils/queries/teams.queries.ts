import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { apiClient } from "../api-client";
import {
  CreateTeamInput,
  Team,
  TeamWithMembers,
  UpdateTeamInput,
} from "@/types/team.types";
import { PaginatedResponse, PaginationParams } from "@/types/pagination.types";
import { queryOptions } from "@tanstack/react-query";
import { parseAxiosError } from "../api-error.utils";

/**
 * Server function to get team count (global total)
 */
export const getTeamsCount = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ total: number }> => {
    try {
      const request = getRequest();
      const response = await apiClient.get<{ total: number }>("v1/teams/count", {
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
 * Server function to get all teams
 */
export const getAllTeams = createServerFn({ method: "GET" }).handler(
  async (): Promise<Team[]> => {
    try {
      const request = getRequest();
      const response = await apiClient.get<Team[]>("v1/teams", {
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
 * Server function to get paginated teams
 */
export const getTeamsPaginated = createServerFn({ method: "GET" })
  .inputValidator((data: PaginationParams) => data)
  .handler(async ({ data }): Promise<PaginatedResponse<Team>> => {
    try {
      const request = getRequest();
      const params = new URLSearchParams();

      params.set("page", String(data.page ?? 1));
      params.set("pageSize", String(data.pageSize ?? 10));
      if (data.search) params.set("search", data.search);
      if (data.sortBy) params.set("sortBy", data.sortBy);
      if (data.sortOrder) params.set("sortOrder", data.sortOrder);

      const response = await apiClient.get<PaginatedResponse<Team>>(
        `v1/teams?${params.toString()}`,
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
 * Server function to get single team by id & its members
 */
export const getTeamById = createServerFn({ method: "GET" })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }): Promise<TeamWithMembers> => {
    try {
      const request = getRequest();
      const response = await apiClient.get<TeamWithMembers>(
        `v1/teams/${data.id}`,
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
 * Server function to create new team
 */
export const createTeam = createServerFn({ method: "POST" })
  .inputValidator((data: { teamData: CreateTeamInput }) => data)
  .handler(async ({ data }): Promise<TeamWithMembers> => {
    try {
      const request = getRequest();
      const response = await apiClient.post<TeamWithMembers>(
        "v1/teams",
        data.teamData,
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
 * Server function to update team by id
 */
export const updateTeamById = createServerFn({ method: "POST" })
  .inputValidator((data: { teamId: string; teamData: UpdateTeamInput }) => data)
  .handler(async ({ data }): Promise<TeamWithMembers> => {
    try {
      const request = getRequest();
      const response = await apiClient.patch<TeamWithMembers>(
        `v1/teams/${data.teamId}`,
        data.teamData,
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
 * Server function to delete team
 */
export const deleteTeamById = createServerFn({ method: "POST" })
  .inputValidator((data: { teamId: string }) => data)
  .handler(async ({ data }): Promise<void> => {
    try {
      const request = getRequest();
      await apiClient.delete(`v1/teams/${data.teamId}`, {
        headers: {
          cookie: request.headers.get("cookie") || "",
        },
      });
    } catch (error) {
      throw parseAxiosError(error);
    }
  });

/**
 * Server function to add members to team
 */
export const addTeamMembers = createServerFn({ method: "POST" })
  .inputValidator((data: { teamId: string; teamMembersIds: string[] }) => data)
  .handler(async ({ data }): Promise<TeamWithMembers> => {
    try {
      const request = getRequest();
      const response = await apiClient.post<TeamWithMembers>(
        `v1/teams/${data.teamId}/members`,
        { teamMembersIds: data.teamMembersIds },
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
 * Server function to remove team members from team
 */
export const removeTeamMembers = createServerFn({ method: "POST" })
  .inputValidator((data: { teamId: string; teamMembersIds: string[] }) => data)
  .handler(async ({ data }): Promise<void> => {
    try {
      const request = getRequest();
      await apiClient.post(
        `v1/teams/${data.teamId}/members/remove`,
        { teamMembersIds: data.teamMembersIds },
        {
          headers: {
            cookie: request.headers.get("cookie") || "",
          },
        }
      );
    } catch (error) {
      throw parseAxiosError(error);
    }
  });

/**
 * Query options for React Query
 */
export const teamsQueryOptions = () =>
  queryOptions({
    queryKey: ["teams"],
    queryFn: () => getAllTeams(),
    staleTime: 5 * 60 * 1000,
  });

export const teamsPaginatedQueryOptions = (params: PaginationParams) =>
  queryOptions({
    queryKey: ["teams", "paginated", params],
    queryFn: () => getTeamsPaginated({ data: params }),
    staleTime: 5 * 60 * 1000,
  });

export const teamQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ["teams", id],
    queryFn: () => getTeamById({ data: { id } }),
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
  });

export const teamsCountQueryOptions = () =>
  queryOptions({
    queryKey: ["teams", "count"],
    queryFn: () => getTeamsCount(),
    staleTime: 5 * 60 * 1000,
  });

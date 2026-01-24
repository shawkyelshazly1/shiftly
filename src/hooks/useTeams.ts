import { PaginationParams } from "@/types/pagination.types";
import { CreateTeamInput, UpdateTeamInput } from "@/types/team.types";
import {
  addTeamMembers,
  createTeam,
  deleteTeamById,
  removeTeamMembers,
  teamQueryOptions,
  teamsCountQueryOptions,
  teamsPaginatedQueryOptions,
  teamsQueryOptions,
  updateTeamById,
} from "@/utils/queries/teams.queries";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

/**
 * Hook to fetch all teams
 */
export function useTeams() {
  return useQuery(teamsQueryOptions());
}

/**
 * Hook to fetch team count (global total)
 */
export function useTeamsCount() {
  return useQuery(teamsCountQueryOptions());
}

/**
 * Hook to fetch paginated teams
 */
export function useTeamsPaginated(params: PaginationParams) {
  return useQuery(teamsPaginatedQueryOptions(params));
}

/**
 * Hook to get team by id
 */
export function useTeam(id: string) {
  return useQuery(teamQueryOptions(id));
}

/**
 * Hook to create new team
 */
export function useCreateTeam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ teamData }: { teamData: CreateTeamInput }) =>
      createTeam({ data: { teamData } }),
    onSuccess: () => {
      // Invalidating ["teams"] covers all team-related queries including ["teams", "count"]
      queryClient.invalidateQueries({ queryKey: ["teams"] });
    },
  });
}

/**
 * Hook to update team
 */
export function useUpdateTeam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      teamId,
      teamData,
    }: {
      teamId: string;
      teamData: UpdateTeamInput;
    }) => updateTeamById({ data: { teamData, teamId } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
    },
  });
}

/**
 * Hook to delete team
 */
export function useDeleteTeam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ teamId }: { teamId: string }) =>
      deleteTeamById({ data: { teamId } }),
    onSuccess: () => {
      // Invalidating ["teams"] covers all team-related queries including ["teams", "count"]
      queryClient.invalidateQueries({ queryKey: ["teams"] });
    },
  });
}

/**
 * Hook to add team members
 */
export function useAddTeamMembers() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      teamId,
      teamMembersIds,
    }: {
      teamId: string;
      teamMembersIds: string[];
    }) => addTeamMembers({ data: { teamId, teamMembersIds } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
    },
  });
}

/**
 * Hook to remove team members
 */
export function useRemoveTeamMembers() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      teamId,
      teamMembersIds,
    }: {
      teamId: string;
      teamMembersIds: string[];
    }) => removeTeamMembers({ data: { teamId, teamMembersIds } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
    },
  });
}

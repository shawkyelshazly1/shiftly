import { PaginationParams } from "@/types/pagination.types";
import {
  acceptInvitation,
  cancelInvitation,
  invitationsPaginatedQueryOptions,
  invitationsQueryOptions,
  resendInvitation,
} from "@/utils/queries/invitations.queries";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

/**
 * hook to get invitations
 */
export function useInvitations() {
  return useQuery(invitationsQueryOptions());
}

/**
 * Hook to fetch paginated invitations
 */
export function useInvitationsPaginated(params: PaginationParams) {
  return useQuery(invitationsPaginatedQueryOptions(params));
}

/**
 * hook to accept invitation
 */
export function useAcceptInvitation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ token }: { token: string }) =>
      acceptInvitation({ data: { token } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invitations"] });
    },
  });
}

/**
 * hook to resend invitation
 */
export function useResendInvitation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId }: { userId: string }) =>
      resendInvitation({ data: { userId } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invitations"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

/**
 * hook to cancel invitation
 */
export function useCancelInvitation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId }: { userId: string }) =>
      cancelInvitation({ data: { userId } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invitations"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

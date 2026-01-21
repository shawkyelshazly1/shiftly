import { UpdateUserInput } from "@/types/user.types";
import {
  deleteUserById,
  updateUser,
  userQueryOptions,
  usersQueryOptions,
} from "@/utils/queries/users.queries";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

/**
 * Hook to fetch all users
 */
export function useUsers() {
  return useQuery(usersQueryOptions());
}

/**
 * Hook to fetch single user by ID
 */
export function useUser(id: string) {
  return useQuery(userQueryOptions(id));
}

/**
 * Hook to update user
 */
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, userData }: { id: string; userData: UpdateUserInput }) =>
      updateUser({ data: { id, userData } }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

/**
 * Hook to delete user
 */
export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: string }) => deleteUserById({ data: { id } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

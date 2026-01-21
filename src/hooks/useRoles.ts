import { CreateRoleInput, UpdateRoleInput } from "@/types/role.types";
import {
  createRole,
  deleteRoleById,
  roleQueryOptions,
  rolesQueryOptions,
  updateRole,
} from "@/utils/queries/roles.queries";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

/**
 * hook to fetch all roles
 */
export function useRoles() {
  return useQuery(rolesQueryOptions());
}

/**
 * hook to fetch single role by ID
 */
export function useRole(id: string) {
  return useQuery(roleQueryOptions(id));
}

/**
 * hook to create new role
 */
export function useCreateRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateRoleInput) => createRole({ data: input }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });
}

/**
 * update existing role ID
 */
export function useUpdateRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, roleData }: { id: string; roleData: UpdateRoleInput }) =>
      updateRole({ data: { id, roleData } }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["roles", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });
}

/**
 * delete existing role by ID
 */

export function useDeleteRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: string }) => deleteRoleById({ data: { id } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });
}

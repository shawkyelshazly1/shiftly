import { authClient } from "@/lib/auth.client";
import { currentUserPermissionQueryOptions } from "@/utils/auth.permissions.query";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export function usePermissions() {
  const { data: session, isPending: sessionLoading } = authClient.useSession();
  const queryClient = useQueryClient();

  const isAuthenticated = !!session?.user;

  const query = useQuery({
    ...currentUserPermissionQueryOptions(),
    enabled: isAuthenticated,
  });

  const permissions = query.data?.permissions ?? [];

  const can = (permission: string): boolean => {
    return permissions.includes(permission);
  };

  const canAll = (...required: string[]): boolean => {
    return required.every((p) => permissions.includes(p));
  };

  const canAny = (...required: string[]): boolean => {
    return required.some((p) => permissions.includes(p));
  };

  const refetch = () => {
    queryClient.invalidateQueries({ queryKey: ["user-permissions"] });
  };

  return {
    permissions,
    roleId: query.data?.roleId ?? null,
    can,
    canAll,
    canAny,
    refetch,
    isLoading: sessionLoading || query.isLoading,
    isError: query.isError,
  };
}

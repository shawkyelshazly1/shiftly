import { Permission } from "@/constants/permissions";
import { Authsession } from "@/lib/auth.server";
import { currentUserPermissionQueryOptions } from "@/utils/auth.permissions.query";
import { hasPermission } from "@/utils/permissions.utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export function usePermissions() {
  const queryClient = useQueryClient();

  const sessionData = queryClient.getQueryData<Authsession>(["session"]);
  const isAuthenticated = sessionData?.isAuthenticated ?? false;

  const query = useQuery({
    ...currentUserPermissionQueryOptions(),
    enabled: isAuthenticated,
  });

  const permissions = query.data?.permissions ?? [];

  const can = (permission: Permission): boolean =>
    hasPermission(permission, permissions);

  const canAll = (...required: Permission[]): boolean =>
    required.every((p) => hasPermission(p, permissions));

  const canAny = (...required: Permission[]): boolean =>
    required.some((p) => hasPermission(p, permissions));

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
    isLoading: query.isLoading,
    isError: query.isError,
  };
}

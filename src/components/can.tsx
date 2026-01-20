import { usePermissions } from "@/hooks/usePermissions";
import type { ReactNode } from "react";

type CanProps = {
  permission?: string;
  all?: string[];
  any?: string[];
  children: ReactNode;
  fallback?: ReactNode;
};

export default function Can({
  permission,
  all,
  any,
  children,
  fallback,
}: CanProps) {
  const { can, canAny, isLoading, canAll } = usePermissions();

  if (isLoading) return null;

  let hasAccess = false;

  if (permission) {
    hasAccess = can(permission);
  } else if (all) {
    hasAccess = canAll(...all);
  } else if (any) {
    hasAccess = canAny(...any);
  }

  return hasAccess ? <>{children}</> : <>{fallback}</>;
}

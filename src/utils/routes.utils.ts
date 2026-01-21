import { Permission } from "@/constants/permissions";
import { hasAnyPermission, hasPermission } from "./permissions.utils";
import { redirect } from "@tanstack/react-router";

type GuardOptions = {
  permissions: string[];
  redirectTo?: string;
};

/** Require a specific permission */
export function requirePermission(
  required: Permission,
  { permissions, redirectTo = "/" }: GuardOptions
) {
  if (!hasPermission(required, permissions)) {
    throw redirect({ to: redirectTo });
  }
}

/** Require ANY of these permissions */
export function requireAnyPermission(
  required: Permission[],
  { permissions, redirectTo = "/" }: GuardOptions
) {
  if (!hasAnyPermission(required, permissions)) {
    throw redirect({ to: redirectTo });
  }
}

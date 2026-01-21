import { Permission } from "@/constants/permissions";

/** Returns a checker function - useful when checking multiple permissions */
export function createPermissionChecker(userPermissions: string[]) {
  return (permission: Permission): boolean =>
    hasPermission(permission, userPermissions);
}

/** Check if user has ANY of these permissions */
export function hasAnyPermission(
  required: Permission[],
  userPermissions: string[]
): boolean {
  return required.some((p) => hasPermission(p, userPermissions));
}

/** Check if user has ALL of these permissions */
export function hasAllPermissions(
  required: Permission[],
  userPermissions: string[]
): boolean {
  return required.every((p) => hasPermission(p, userPermissions));
}

/** Single permission check */
export function hasPermission(
  permission: Permission,
  userPermissions: string[]
): boolean {
  if (userPermissions.includes(permission)) return true;
  if (userPermissions.includes("*")) return true;
  const [resource] = permission.split(":");
  if (userPermissions.includes(`${resource}:*`)) return true;
  return false;
}

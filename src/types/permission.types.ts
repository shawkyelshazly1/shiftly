export type Permission = {
  id: string;
  name: string;
  description: string | null;
  action: string;
  resource: string;
  createdAt: string;
};

export type GroupedPermissions = {
  [resource: string]: Permission[];
};

export function groupPermissionsByResource(
  permissions: Permission[]
): GroupedPermissions {
  return permissions.reduce((acc, permission) => {
    const resource = permission.resource;
    if (!acc[resource]) {
      acc[resource] = [];
    }
    acc[resource].push(permission);

    return acc;
  }, {} as GroupedPermissions);
}

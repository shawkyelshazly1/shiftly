// response from GET /api/v1/roles
export type Role = {
  id: string;
  name: string;
  description: string;
  isSystem: boolean;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
  permissions: Array<{
    id: string;
    name: string;
    resource: string;
    action: string;
    description: string;
  }>;
};

export type CreateRoleInput = {
  name: string;
  description: string;
  permissionIds?: string[];
  isDefault?: boolean;
};

export type UpdateRoleInput = Partial<CreateRoleInput>;

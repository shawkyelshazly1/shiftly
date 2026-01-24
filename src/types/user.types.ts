import { Permission } from "./permission.types";

export type User = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  roleId: string;
  roleName: string | null;
  createdAt: string;
  updatedAt: string;
  invitationStatus?: 'pending' | 'accepted' | 'expired' | 'cancelled' | null;
  invitationExpiresAt?: string | null;
};

export type UserWithPermissions = User & {
  directPermissions: Permission[];
};

export type UpdateUserInput = {
  roleId?: string;
  directPermissionIds?: string[];
};

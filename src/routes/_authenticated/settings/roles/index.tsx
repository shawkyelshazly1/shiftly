import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";

import Error from "@/assets/status-error.svg?react";
import { PERMISSIONS } from "@/constants/permissions";
import {
  useCreateRole,
  useDeleteRole,
  useRolesPaginated,
  useUpdateRole,
} from "@/hooks/useRoles";
import { useTableState } from "@/hooks/useTableState";
import { useDebounce } from "@/hooks/useDebounce";
import { CreateRoleInput, Role, UpdateRoleInput } from "@/types/role.types";
import { currentUserPermissionQueryOptions } from "@/utils/auth.permissions.query";
import { handleError } from "@/utils/error-messages";
import { permissionsQueryOptions } from "@/utils/queries/permissions.queries";
import { requireAnyPermission } from "@/utils/routes.utils";

import RoleForm from "./-components/role-form";
import { RolesGrid, RolesGridSkeleton } from "./-components/roles-grid";
import { RolesStats } from "./-components/roles-stats";
import { RolesSearchBar } from "./-components/roles-search-bar";
import { RolesEmptyState } from "./-components/roles-empty-state";
import { RolesPagination } from "./-components/roles-pagination";
import { RolesPageHeader } from "./-components/roles-page-header";

const ROLES_PAGE_SIZE = 12;

export const Route = createFileRoute("/_authenticated/settings/roles/")({
  component: RolesPage,
  beforeLoad: async ({ context }) => {
    const { permissions } = await context.queryClient.ensureQueryData(
      currentUserPermissionQueryOptions()
    );
    requireAnyPermission(
      [PERMISSIONS.ROLES_ALL, PERMISSIONS.ROLES_READ],
      { permissions }
    );
    return { auth: context.auth };
  },
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(permissionsQueryOptions()),
});

function RolesPage() {
  const { params, handlePaginationChange, handleSearchChange } = useTableState({
    pageSize: ROLES_PAGE_SIZE,
  });
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearch = useDebounce(searchValue, 300);

  const { data, isLoading, isError } = useRolesPaginated({
    ...params,
    search: debouncedSearch || undefined,
  });
  const createRole = useCreateRole();
  const updateRole = useUpdateRole();
  const deleteRole = useDeleteRole();

  const [formOpen, setFormOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const handleSearchInputChange = (value: string) => {
    setSearchValue(value);
    if (!value) handleSearchChange("");
  };

  const handleCreate = () => {
    setSelectedRole(null);
    setFormOpen(true);
  };

  const handleEdit = (role: Role) => {
    setSelectedRole(role);
    setFormOpen(true);
  };

  const handleDelete = async (role: Role) => {
    if (role.isSystem) {
      toast.error("System roles cannot be deleted");
      return;
    }
    if (!confirm(`Are you sure you want to delete "${role.name}"?`)) return;

    try {
      await deleteRole.mutateAsync({ id: role.id });
      toast.success("Role deleted successfully");
    } catch (error) {
      handleError(error);
    }
  };

  const handleSubmit = async (data: CreateRoleInput | UpdateRoleInput) => {
    try {
      if (selectedRole) {
        await updateRole.mutateAsync({ id: selectedRole.id, roleData: data });
        toast.success("Role updated successfully");
      } else {
        await createRole.mutateAsync(data as CreateRoleInput);
        toast.success("Role created successfully");
      }
      setFormOpen(false);
    } catch (error) {
      handleError(error);
    }
  };

  if (isError) {
    return (
      <div className="flex flex-col flex-1 justify-center items-center gap-4">
        <Error height={280} width={280} />
        <div className="text-center">
          <h1 className="text-xl font-semibold">Something went wrong</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Unable to load roles. Please try again.
          </p>
        </div>
      </div>
    );
  }

  const roles = data?.data ?? [];
  const pagination = data?.pagination;

  // Calculate stats
  const systemRoles = roles.filter((r) => r.isSystem).length;
  const customRoles = roles.filter((r) => !r.isSystem).length;
  const totalPermissions = roles.reduce(
    (acc, r) => acc + r.permissions.length,
    0
  );

  return (
    <div className="flex-1 flex flex-col gap-8">
      <RolesPageHeader onCreateClick={handleCreate} />

      <RolesStats
        totalRoles={pagination?.total ?? roles.length}
        systemRoles={systemRoles}
        customRoles={customRoles}
        totalPermissions={totalPermissions}
        isLoading={isLoading}
      />

      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold">All Roles</h2>
            <p className="text-sm text-muted-foreground">
              Click on a role to view and edit its permissions
            </p>
          </div>
          <RolesSearchBar value={searchValue} onChange={handleSearchInputChange} />
        </div>

        {isLoading ? (
          <RolesGridSkeleton />
        ) : roles.length === 0 ? (
          <RolesEmptyState
            hasSearch={!!debouncedSearch}
            onCreateClick={handleCreate}
          />
        ) : (
          <RolesGrid roles={roles} onEdit={handleEdit} onDelete={handleDelete} />
        )}

        {pagination && pagination.totalPages > 1 && (
          <RolesPagination
            pagination={pagination}
            onPageChange={(page) =>
              handlePaginationChange(page, params.pageSize ?? ROLES_PAGE_SIZE)
            }
          />
        )}
      </div>

      <RoleForm
        open={formOpen}
        onOpenChange={setFormOpen}
        role={selectedRole}
        onSubmit={handleSubmit}
        isSubmitting={createRole.isPending || updateRole.isPending}
      />
    </div>
  );
}

import { useMemo, useState, useCallback } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Row } from "@tanstack/react-table";
import { Users } from "lucide-react";
import { toast } from "sonner";

import Error from "@/assets/status-error.svg?react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { StatsCard } from "@/components/ui/stats-card";
import { BulkActionsBar } from "@/components/ui/bulk-actions-bar";
import { PERMISSIONS } from "@/constants/permissions";
import { useDeleteUser, useUpdateUser, useUsersCount, useUsersPaginated } from "@/hooks/useUsers";
import { useResendInvitation } from "@/hooks/useInvitations";
import { useRoles } from "@/hooks/useRoles";
import { useTeams } from "@/hooks/useTeams";
import { useTableState } from "@/hooks/useTableState";
import type { FilterConfig } from "@/components/ui/data-table";
import { UpdateUserInput, User } from "@/types/user.types";
import { currentUserPermissionQueryOptions } from "@/utils/auth.permissions.query";
import { handleError } from "@/utils/error-messages";
import { permissionsQueryOptions } from "@/utils/queries/permissions.queries";
import { rolesQueryOptions } from "@/utils/queries/roles.queries";
import { teamsQueryOptions } from "@/utils/queries/teams.queries";
import { userQueryOptions } from "@/utils/queries/users.queries";
import { requireAnyPermission } from "@/utils/routes.utils";
import { UserForm } from "./-components/user-form";
import { getUsersColumns, UserCard } from "./-components/users-columns";

export const Route = createFileRoute("/_authenticated/settings/users/")({
  component: UsersPage,
  beforeLoad: async ({ context }) => {
    const { permissions } = await context.queryClient.ensureQueryData(
      currentUserPermissionQueryOptions()
    );
    requireAnyPermission([PERMISSIONS.USERS_ALL, PERMISSIONS.USERS_READ], { permissions });
    return { auth: context.auth };
  },
  loader: ({ context }) =>
    Promise.all([
      context.queryClient.ensureQueryData(rolesQueryOptions()),
      context.queryClient.ensureQueryData(permissionsQueryOptions()),
      context.queryClient.ensureQueryData(teamsQueryOptions()),
    ]),
});

function UsersPage() {
  const { params, handlePaginationChange, handleSearchChange, handleSortChange, handleFilterChange } = useTableState();
  const { data, isLoading, isError } = useUsersPaginated(params);
  const { data: counts, isLoading: isCountsLoading } = useUsersCount();
  const { data: roles } = useRoles();
  const { data: teams } = useTeams();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();
  const resendInvitation = useResendInvitation();

  const [formOpen, setFormOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  const { data: selectedUser } = useQuery({
    ...userQueryOptions(selectedUserId || ""),
    enabled: !!selectedUserId,
  });

  const handleEdit = useCallback((user: User) => {
    setSelectedUserId(user.id);
    setFormOpen(true);
  }, []);

  const handleDelete = useCallback(async (user: User) => {
    if (!confirm(`Are you sure you want to delete "${user.name}"?`)) return;
    try {
      await deleteUser.mutateAsync({ id: user.id });
      toast.success("User deleted successfully");
    } catch (error) {
      handleError(error);
    }
  }, [deleteUser]);

  const handleResendInvitation = useCallback(async (user: User) => {
    try {
      await resendInvitation.mutateAsync({ userId: user.id });
      toast.success("Invitation resent successfully");
    } catch (error) {
      handleError(error);
    }
  }, [resendInvitation]);

  const handleSubmit = async (data: UpdateUserInput) => {
    if (!selectedUserId) return;
    try {
      await updateUser.mutateAsync({ id: selectedUserId, userData: data });
      toast.success("User updated successfully");
      setFormOpen(false);
      setSelectedUserId(null);
    } catch (error) {
      handleError(error);
    }
  };

  const handleFormClose = (open: boolean) => {
    setFormOpen(open);
    if (!open) setSelectedUserId(null);
  };

  const handleBulkDelete = async () => {
    if (selectedUsers.length === 0) return;
    setIsBulkDeleting(true);
    try {
      await Promise.all(selectedUsers.map((user) => deleteUser.mutateAsync({ id: user.id })));
      toast.success(`${selectedUsers.length} user${selectedUsers.length > 1 ? "s" : ""} deleted successfully`);
      setSelectedUsers([]);
    } catch (error) {
      handleError(error);
    } finally {
      setIsBulkDeleting(false);
    }
  };

  const handleRowSelectionChange = useCallback((rows: User[]) => {
    setSelectedUsers((prev) => {
      // Avoid triggering re-renders when both are empty arrays
      if (prev.length === 0 && rows.length === 0) return prev;
      return rows;
    });
  }, []);

  const handleClearSelection = useCallback(() => {
    setSelectedUsers([]);
  }, []);

  const columns = useMemo(
    () => getUsersColumns({ onEdit: handleEdit, onDelete: handleDelete, onResendInvitation: handleResendInvitation }),
    [handleEdit, handleDelete, handleResendInvitation]
  );

  const filters: FilterConfig[] = useMemo(
    () => [
      {
        key: "roleId",
        label: "Role",
        value: params.roleId,
        options: (roles ?? []).map((role) => ({
          value: role.id,
          label: role.name,
        })),
      },
      {
        key: "teamId",
        label: "Team",
        value: params.teamId,
        options: (teams ?? []).map((team) => ({
          value: team.id,
          label: team.name,
        })),
      },
    ],
    [roles, teams, params.roleId, params.teamId]
  );

  // Mobile card renderer
  const renderMobileCard = useCallback((row: Row<User>) => {
    const user = row.original;
    return (
      <UserCard
        user={user}
        isSelected={row.getIsSelected()}
        onSelect={(checked) => row.toggleSelected(checked)}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onResendInvitation={handleResendInvitation}
      />
    );
  }, [handleEdit, handleDelete, handleResendInvitation]);

  if (isError) {
    return (
      <div className="flex flex-col flex-1 justify-center items-center gap-2 p-4">
        <Error height={200} width={200} className="sm:h-[300px] sm:w-[300px]" />
        <h1 className="text-lg sm:text-xl font-semibold text-center">Something went wrong</h1>
      </div>
    );
  }

  const users = data?.data ?? [];
  const pagination = data?.pagination;

  return (
    <div className="flex-1 flex flex-col gap-4 sm:gap-6">
      <PageHeader />
      <StatsCard
        title="Total Users"
        value={counts?.total ?? 0}
        icon={Users}
        isLoading={isCountsLoading}
        className="w-full sm:w-auto sm:max-w-xs"
      />

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">All Users</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={users}
            searchPlaceholder="Search users..."
            pagination={pagination}
            onPaginationChange={handlePaginationChange}
            onSearchChange={handleSearchChange}
            onSortChange={handleSortChange}
            filters={filters}
            onFilterChange={handleFilterChange}
            isLoading={isLoading}
            enableRowSelection
            onRowSelectionChange={handleRowSelectionChange}
            getRowId={(row) => row.id}
            renderMobileCard={renderMobileCard}
          />
        </CardContent>
      </Card>

      <UserForm
        open={formOpen}
        onOpenChange={handleFormClose}
        user={selectedUser || null}
        onSubmit={handleSubmit}
        isSubmitting={updateUser.isPending}
      />

      <BulkActionsBar
        selectedCount={selectedUsers.length}
        onClear={handleClearSelection}
        onDelete={handleBulkDelete}
        isDeleting={isBulkDeleting}
        entityName="user"
      />
    </div>
  );
}

function PageHeader() {
  return (
    <div>
      <h1 className="font-semibold text-xl sm:text-2xl">Users</h1>
      <p className="text-muted-foreground text-sm mt-1">Manage users, roles, and permissions</p>
    </div>
  );
}

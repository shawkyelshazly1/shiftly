import { useMemo, useState, useCallback } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Row } from "@tanstack/react-table";
import { Plus, UsersRound } from "lucide-react";
import { toast } from "sonner";

import Error from "@/assets/status-error.svg?react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { StatsCard } from "@/components/ui/stats-card";
import { BulkActionsBar } from "@/components/ui/bulk-actions-bar";
import { PERMISSIONS } from "@/constants/permissions";
import { useCreateTeam, useDeleteTeam, useTeamsCount, useUpdateTeam } from "@/hooks/useTeams";
import { useTableState } from "@/hooks/useTableState";
import { CreateTeamInput, TeamWithMembers, UpdateTeamInput } from "@/types/team.types";
import { currentUserPermissionQueryOptions } from "@/utils/auth.permissions.query";
import { handleError } from "@/utils/error-messages";
import { teamsPaginatedQueryOptions } from "@/utils/queries/teams.queries";
import { requireAnyPermission } from "@/utils/routes.utils";
import { getTeamsColumns, TeamCard } from "./-components/teams-columns";
import { TeamForm } from "./-components/team-form";

export const Route = createFileRoute("/_authenticated/settings/teams/")({
  component: TeamsPage,
  beforeLoad: async ({ context }) => {
    const { permissions } = await context.queryClient.ensureQueryData(
      currentUserPermissionQueryOptions()
    );
    requireAnyPermission([PERMISSIONS.TEAMS_ALL], { permissions });
    return { auth: context.auth };
  },
});

function TeamsPage() {
  const { params, handlePaginationChange, handleSearchChange, handleSortChange } = useTableState();

  // Use the paginated query that returns TeamWithMembers
  const { data, isLoading, isError } = useQuery(teamsPaginatedQueryOptions(params));
  const { data: counts, isLoading: isCountsLoading } = useTeamsCount();
  const createTeam = useCreateTeam();
  const updateTeam = useUpdateTeam();
  const deleteTeam = useDeleteTeam();

  const [formOpen, setFormOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<TeamWithMembers | null>(null);
  const [selectedTeams, setSelectedTeams] = useState<TeamWithMembers[]>([]);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  const handleCreate = useCallback(() => {
    setSelectedTeam(null);
    setFormOpen(true);
  }, []);

  const handleEdit = useCallback((team: TeamWithMembers) => {
    setSelectedTeam(team);
    setFormOpen(true);
  }, []);

  const handleDelete = useCallback(async (team: TeamWithMembers) => {
    if (!confirm(`Are you sure you want to delete "${team.name}"?`)) return;
    try {
      await deleteTeam.mutateAsync({ teamId: team.id });
      toast.success("Team deleted successfully");
    } catch (error) {
      handleError(error);
    }
  }, [deleteTeam]);

  const handleSubmit = async (data: CreateTeamInput | UpdateTeamInput) => {
    try {
      if (selectedTeam) {
        await updateTeam.mutateAsync({ teamId: selectedTeam.id, teamData: data });
        toast.success("Team updated successfully");
      } else {
        await createTeam.mutateAsync({ teamData: data as CreateTeamInput });
        toast.success("Team created successfully");
      }
      setFormOpen(false);
      setSelectedTeam(null);
    } catch (error) {
      handleError(error);
    }
  };

  const handleFormClose = (open: boolean) => {
    setFormOpen(open);
    if (!open) setSelectedTeam(null);
  };

  const handleBulkDelete = async () => {
    if (selectedTeams.length === 0) return;
    setIsBulkDeleting(true);
    try {
      await Promise.all(selectedTeams.map((team) => deleteTeam.mutateAsync({ teamId: team.id })));
      toast.success(`${selectedTeams.length} team${selectedTeams.length > 1 ? "s" : ""} deleted successfully`);
      setSelectedTeams([]);
    } catch (error) {
      handleError(error);
    } finally {
      setIsBulkDeleting(false);
    }
  };

  const handleRowSelectionChange = useCallback((rows: TeamWithMembers[]) => {
    setSelectedTeams((prev) => {
      // Avoid triggering re-renders when both are empty arrays
      if (prev.length === 0 && rows.length === 0) return prev;
      return rows;
    });
  }, []);

  const handleClearSelection = useCallback(() => {
    setSelectedTeams([]);
  }, []);

  const columns = useMemo(
    () => getTeamsColumns({ onEdit: handleEdit, onDelete: handleDelete }),
    [handleEdit, handleDelete]
  );

  // Mobile card renderer
  const renderMobileCard = useCallback((row: Row<TeamWithMembers>) => {
    const team = row.original;
    return (
      <TeamCard
        team={team}
        isSelected={row.getIsSelected()}
        onSelect={(checked) => row.toggleSelected(checked)}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    );
  }, [handleEdit, handleDelete]);

  if (isError) {
    return (
      <div className="flex flex-col flex-1 justify-center items-center gap-2 p-4">
        <Error height={200} width={200} className="sm:h-[300px] sm:w-[300px]" />
        <h1 className="text-lg sm:text-xl font-semibold text-center">Something went wrong</h1>
      </div>
    );
  }

  // Cast data to TeamWithMembers[] since the API returns teams with members
  const teams = (data?.data ?? []) as TeamWithMembers[];
  const pagination = data?.pagination;

  return (
    <div className="flex-1 flex flex-col gap-4 sm:gap-6">
      <PageHeader onCreateClick={handleCreate} />
      <StatsCard
        title="Total Teams"
        value={counts?.total ?? 0}
        icon={UsersRound}
        isLoading={isCountsLoading}
        className="w-full sm:w-auto sm:max-w-xs"
      />

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">All Teams</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={teams}
            searchPlaceholder="Search teams..."
            pagination={pagination}
            onPaginationChange={handlePaginationChange}
            onSearchChange={handleSearchChange}
            onSortChange={handleSortChange}
            isLoading={isLoading}
            enableRowSelection
            onRowSelectionChange={handleRowSelectionChange}
            getRowId={(row) => row.id}
            renderMobileCard={renderMobileCard}
          />
        </CardContent>
      </Card>

      <TeamForm
        open={formOpen}
        onOpenChange={handleFormClose}
        team={selectedTeam}
        onSubmit={handleSubmit}
        isSubmitting={createTeam.isPending || updateTeam.isPending}
      />

      <BulkActionsBar
        selectedCount={selectedTeams.length}
        onClear={handleClearSelection}
        onDelete={handleBulkDelete}
        isDeleting={isBulkDeleting}
        entityName="team"
      />
    </div>
  );
}

function PageHeader({ onCreateClick }: { onCreateClick: () => void }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="font-semibold text-xl sm:text-2xl">Teams</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage teams and their members</p>
      </div>
      <Button onClick={onCreateClick} className="w-full sm:w-auto">
        <Plus className="h-4 w-4 mr-2" />
        Create Team
      </Button>
    </div>
  );
}

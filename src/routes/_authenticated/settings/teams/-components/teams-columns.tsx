import { memo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { MoreVertical, Pencil, Trash2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTableColumnHeader } from "@/components/ui/data-table";
import { TeamWithMembers } from "@/types/team.types";

interface TeamsColumnsProps {
  onEdit: (team: TeamWithMembers) => void;
  onDelete: (team: TeamWithMembers) => void;
}

export function getTeamsColumns({ onEdit, onDelete }: TeamsColumnsProps): ColumnDef<TeamWithMembers>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-[2px]"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-[2px]"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Team Name" />,
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2">
            <Users className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="font-medium">{row.original.name}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm line-clamp-1">
          {row.original.description || "No description"}
        </span>
      ),
    },
    {
      id: "memberCount",
      accessorFn: (row) => row.users?.length ?? 0,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Members" />,
      cell: ({ row }) => {
        const memberCount = row.original.users?.length ?? 0;
        return (
          <Badge variant="secondary" className="font-normal">
            <Users className="h-3 w-3 mr-1" />
            {memberCount} {memberCount === 1 ? "member" : "members"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Created" />,
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm">
          {row.original.createdAt
            ? new Date(row.original.createdAt).toLocaleDateString()
            : "-"}
        </span>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const team = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(team)}>
                <Pencil className="h-4 w-4 mr-2" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(team)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}

// Mobile card component for teams
export const TeamCard = memo(function TeamCard({
  team,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
}: {
  team: TeamWithMembers;
  isSelected: boolean;
  onSelect: (checked: boolean) => void;
  onEdit: (team: TeamWithMembers) => void;
  onDelete: (team: TeamWithMembers) => void;
}) {
  const memberCount = team.users?.length ?? 0;

  return (
    <div
      className={`rounded-lg border bg-card p-4 transition-colors ${
        isSelected ? "border-primary bg-primary/5" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        <Checkbox
          checked={isSelected}
          onCheckedChange={onSelect}
          aria-label={`Select ${team.name}`}
          className="mt-1"
        />
        <div className="rounded-lg bg-primary/10 p-2.5 shrink-0">
          <Users className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="font-medium truncate">{team.name}</p>
              <p className="text-sm text-muted-foreground line-clamp-2 mt-0.5">
                {team.description || "No description"}
              </p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(team)}>
                  <Pencil className="h-4 w-4 mr-2" /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDelete(team)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <Badge variant="secondary" className="font-normal text-xs">
              <Users className="h-3 w-3 mr-1" />
              {memberCount} {memberCount === 1 ? "member" : "members"}
            </Badge>
            {team.createdAt && (
              <span className="text-xs text-muted-foreground">
                Created {new Date(team.createdAt).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

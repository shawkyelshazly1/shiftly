import { memo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Mail, MoreVertical, Pencil, Shield, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTableColumnHeader } from "@/components/ui/data-table";
import { User } from "@/types/user.types";
import { getInitials } from "@/utils/string.utils";

function UserStatusBadge({ verified }: { verified: boolean }) {
  return verified ? (
    <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-500/20">
      Verified
    </Badge>
  ) : (
    <Badge
      variant="secondary"
      className="bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20 border-yellow-500/20"
    >
      Pending
    </Badge>
  );
}

interface UsersColumnsProps {
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onResendInvitation: (user: User) => void;
}

export function getUsersColumns({ onEdit, onDelete, onResendInvitation }: UsersColumnsProps): ColumnDef<User>[] {
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
      header: ({ column }) => <DataTableColumnHeader column={column} title="User" />,
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src={user.image || undefined} alt={user.name} />
              <AvatarFallback className="text-xs">{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="font-medium truncate">{user.name}</p>
              <p className="text-sm text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "roleName",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Role" />,
      cell: ({ row }) => (
        <Badge variant="outline" className="font-normal">
          <Shield className="h-3 w-3 mr-1" />
          {row.original.roleName || "No role"}
        </Badge>
      ),
    },
    {
      accessorKey: "emailVerified",
      header: "Status",
      cell: ({ row }) => <UserStatusBadge verified={row.original.emailVerified} />,
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Joined" />,
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm">
          {new Date(row.original.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(user)}>
                <Pencil className="h-4 w-4 mr-2" /> Edit
              </DropdownMenuItem>
              {(user.invitationStatus === "pending" || user.invitationStatus === "expired") && (
                <DropdownMenuItem onClick={() => onResendInvitation(user)}>
                  <Mail className="h-4 w-4 mr-2" /> Resend Invitation
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={() => onDelete(user)}
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

// Mobile card component for users
export const UserCard = memo(function UserCard({
  user,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  onResendInvitation,
}: {
  user: User;
  isSelected: boolean;
  onSelect: (checked: boolean) => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onResendInvitation: (user: User) => void;
}) {
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
          aria-label={`Select ${user.name}`}
          className="mt-1"
        />
        <Avatar className="h-10 w-10">
          <AvatarImage src={user.image || undefined} alt={user.name} />
          <AvatarFallback className="text-xs">{getInitials(user.name)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="font-medium truncate">{user.name}</p>
              <p className="text-sm text-muted-foreground truncate">{user.email}</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(user)}>
                  <Pencil className="h-4 w-4 mr-2" /> Edit
                </DropdownMenuItem>
                {(user.invitationStatus === "pending" || user.invitationStatus === "expired") && (
                  <DropdownMenuItem onClick={() => onResendInvitation(user)}>
                    <Mail className="h-4 w-4 mr-2" /> Resend Invitation
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  onClick={() => onDelete(user)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <Badge variant="outline" className="font-normal text-xs">
              <Shield className="h-3 w-3 mr-1" />
              {user.roleName || "No role"}
            </Badge>
            <UserStatusBadge verified={user.emailVerified} />
            <span className="text-xs text-muted-foreground">
              Joined {new Date(user.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});

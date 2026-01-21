import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useUsers, useUpdateUser, useDeleteUser } from "@/hooks/useUsers";
import { usersQueryOptions } from "@/utils/queries/users.queries";
import { rolesQueryOptions } from "@/utils/queries/roles.queries";
import { permissionsQueryOptions } from "@/utils/queries/permissions.queries";
import { currentUserPermissionQueryOptions } from "@/utils/auth.permissions.query";
import { requireAnyPermission } from "@/utils/routes.utils";
import { PERMISSIONS } from "@/constants/permissions";
import { User, UpdateUserInput } from "@/types/user.types";
import { UserForm } from "./-components/user-form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Error from "@/assets/status-error.svg?react";
import Loader from "@/assets/loader-pulse.svg?react";
import {
  MoreVertical,
  Search,
  Pencil,
  Trash2,
  Users,
  Shield,
  UserCheck,
} from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { userQueryOptions } from "@/utils/queries/users.queries";

export const Route = createFileRoute("/_authenticated/_manage/manage/users/")({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    const { permissions } = await context.queryClient.ensureQueryData(
      currentUserPermissionQueryOptions()
    );
    requireAnyPermission([PERMISSIONS.USERS_ALL, PERMISSIONS.USERS_READ], {
      permissions,
    });

    return { auth: context.auth };
  },
  loader: ({ context }) =>
    Promise.all([
      context.queryClient.ensureQueryData(usersQueryOptions()),
      context.queryClient.ensureQueryData(rolesQueryOptions()),
      context.queryClient.ensureQueryData(permissionsQueryOptions()),
    ]),
});

function RouteComponent() {
  const { data: users, isLoading, isError } = useUsers();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  const [formOpen, setFormOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch selected user with permissions
  const { data: selectedUser } = useQuery({
    ...userQueryOptions(selectedUserId || ""),
    enabled: !!selectedUserId,
  });

  const handleEdit = (user: User) => {
    setSelectedUserId(user.id);
    setFormOpen(true);
  };

  const handleDelete = async (user: User) => {
    if (!confirm(`Are you sure you want to delete "${user.name}"?`)) return;

    try {
      await deleteUser.mutateAsync({ id: user.id });
      toast.success("User deleted successfully");
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };

  const handleSubmit = async (data: UpdateUserInput) => {
    if (!selectedUserId) return;

    try {
      await updateUser.mutateAsync({ id: selectedUserId, userData: data });
      toast.success("User updated successfully");
      setFormOpen(false);
      setSelectedUserId(null);
    } catch (error) {
      toast.error("Failed to update user");
    }
  };

  const handleFormClose = (open: boolean) => {
    setFormOpen(open);
    if (!open) {
      setSelectedUserId(null);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Ensure users is an array
  const usersList = Array.isArray(users) ? users : [];

  // Filter users based on search
  const filteredUsers = usersList.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.roleName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Stats
  const totalUsers = usersList.length;
  const verifiedUsers = usersList.filter((u) => u.emailVerified).length;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-1 mx-auto h-full flex-1 justify-center items-center">
        <Loader width={150} height={150} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col gap-1 mx-auto h-full justify-center items-center flex-1">
        <Error height={300} width={300} />
        <h1 className="text-xl font-semibold">Oops! Something went wrong</h1>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col gap-6 w-full container mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-semibold text-2xl">User Management</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage users, roles, and permissions
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{verifiedUsers}</div>
            <p className="text-xs text-muted-foreground">
              {totalUsers > 0
                ? `${Math.round((verifiedUsers / totalUsers) * 100)}% of users`
                : "No users yet"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Table */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-lg">All Users</CardTitle>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[300px]">User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="hidden md:table-cell">Status</TableHead>
                <TableHead className="hidden lg:table-cell">Joined</TableHead>
                <TableHead className="w-[70px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers && filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage
                            src={user.image || undefined}
                            alt={user.name}
                          />
                          <AvatarFallback className="text-xs">
                            {getInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="font-medium truncate">{user.name}</p>
                          <p className="text-sm text-muted-foreground truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-normal">
                        <Shield className="h-3 w-3 mr-1" />
                        {user.roleName || "No role"}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {user.emailVerified ? (
                        <Badge
                          variant="default"
                          className="bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-500/20"
                        >
                          Verified
                        </Badge>
                      ) : (
                        <Badge
                          variant="secondary"
                          className="bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20 border-yellow-500/20"
                        >
                          Pending
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-muted-foreground text-sm">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(user)}>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(user)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    {searchQuery
                      ? "No users found matching your search"
                      : "No users yet"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* User Form Dialog */}
      <UserForm
        open={formOpen}
        onOpenChange={handleFormClose}
        user={selectedUser || null}
        onSubmit={handleSubmit}
        isSubmitting={updateUser.isPending}
      />
    </div>
  );
}

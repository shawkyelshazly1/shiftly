import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  useRoles,
  useCreateRole,
  useUpdateRole,
  useDeleteRole,
} from "@/hooks/useRoles";
import { rolesQueryOptions } from "@/utils/queries/roles.queries";
import { permissionsQueryOptions } from "@/utils/queries/permissions.queries";
import { Role, CreateRoleInput, UpdateRoleInput } from "@/types/role.types";
import RoleForm from "./-components/role-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Error from "@/assets/status-error.svg?react";
import Loader from "@/assets/loader-pulse.svg?react";
import {
  MoreVertical,
  Plus,
  Shield,
  Pencil,
  Trash2,
  Users,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_admin/admin/roles")({
  component: RouteComponent,
  loader: ({ context }) =>
    Promise.all([
      context.queryClient.ensureQueryData(rolesQueryOptions()),
      context.queryClient.ensureQueryData(permissionsQueryOptions()),
    ]),
});

function RouteComponent() {
  const { data: roles, isLoading, isError } = useRoles();
  const createRole = useCreateRole();
  const updateRole = useUpdateRole();
  const deleteRole = useDeleteRole();

  const [formOpen, setFormOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

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
      toast.error("Failed to delete role");
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
      toast.error(
        selectedRole ? "Failed to update role" : "Failed to create role"
      );
    }
  };

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-semibold text-2xl">Roles & Permissions</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage roles and their assigned permissions
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Create Role
        </Button>
      </div>

      {/* Roles Grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {roles?.map((role) => (
          <Card key={role.id} className="relative">
            <CardHeader className="p-4 pb-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  <CardTitle className="text-sm font-medium">
                    {role.name}
                  </CardTitle>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <MoreVertical className="h-3.5 w-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(role)}>
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDelete(role)}
                      disabled={role.isSystem}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex gap-1 mt-1">
                {role.isSystem && (
                  <Badge variant="secondary" className="text-xs px-1.5 py-0">
                    System
                  </Badge>
                )}
                {role.isDefault && (
                  <Badge variant="outline" className="text-xs px-1.5 py-0">
                    Default
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-2">
              <p className="text-xs text-muted-foreground mb-2 line-clamp-1">
                {role.description || "No description"}
              </p>
              <div className="flex flex-wrap gap-1">
                {role.permissions.slice(0, 3).map((perm) => (
                  <Badge
                    key={perm.id}
                    variant="outline"
                    className="text-xs font-normal px-1.5 py-0"
                  >
                    {perm.name}
                  </Badge>
                ))}
                {role.permissions.length > 3 && (
                  <Badge
                    variant="outline"
                    className="text-xs font-normal px-1.5 py-0"
                  >
                    +{role.permissions.length - 3}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Role Form Dialog */}
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

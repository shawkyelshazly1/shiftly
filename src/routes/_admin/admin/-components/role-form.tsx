import { PermissionGroup } from "@/components/permission-group";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { groupPermissionsByResource } from "@/types/permission.types";
import { CreateRoleInput, Role, UpdateRoleInput } from "@/types/role.types";
import { permissionsQueryOptions } from "@/utils/queries/permissions.queries";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

interface RoleFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role?: Role | null; // null = create mode, Role = edit mode
  onSubmit: (data: CreateRoleInput | UpdateRoleInput) => void;
  isSubmitting?: boolean;
}

export default function RoleForm({
  open,
  onOpenChange,
  role,
  onSubmit,
  isSubmitting,
}: RoleFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<string[]>(
    []
  );

  const { data: permissions = [] } = useQuery(permissionsQueryOptions());
  const groupedPermissions = groupPermissionsByResource(permissions);

  console.log(role);

  // Reset form when role changes or dialog opens
  useEffect(() => {
    if (open) {
      if (role) {
        setName(role.name);
        setDescription(role.description || "");
        setSelectedPermissionIds(role.permissions.map((p) => p.id));
      } else {
        setName("");
        setDescription("");
        setSelectedPermissionIds([]);
      }
    }
  }, [open, role]);

  const handleTogglePermission = (permissionId: string) => {
    setSelectedPermissionIds((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const handleToggleWildcard = (
    wildcardId: string,
    individualIds: string[]
  ) => {
    setSelectedPermissionIds((prev) => {
      const hasWildcard = prev.includes(wildcardId);

      if (hasWildcard) {
        // Remove wildcard
        return prev.filter((id) => id !== wildcardId);
      } else {
        // Add wildcard, remove individual permissions from this group
        return [
          ...prev.filter((id) => !individualIds.includes(id)),
          wildcardId,
        ];
      }
    });
  };

  const handleSelectAllIndividuals = (
    wildcardId: string,
    individualIds: string[]
  ) => {
    // Remove all individuals and add wildcard
    setSelectedPermissionIds((prev) => [
      ...prev.filter((id) => !individualIds.includes(id)),
      wildcardId,
    ]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      description,
      permissionIds: selectedPermissionIds,
    });
  };

  const isEditMode = !!role;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-h-[90vh] overflow-y-auto sm:max-w-4xl!">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Role" : "Create New Role"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Role Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Team Lead"
                disabled={role?.isSystem}
                required
              />
              {role?.isSystem && (
                <p className="text-xs text-muted-foreground">
                  System role names cannot be changed
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what this role is for..."
                rows={2}
              />
            </div>
          </div>

          <Label>Permissions</Label>
          <div className="grid gap-3 md:grid-cols-2">
            {Object.entries(groupedPermissions).map(([resource, perms]) => (
              <PermissionGroup
                key={resource}
                resource={resource}
                permissions={perms}
                selectedIds={selectedPermissionIds}
                onToggle={handleTogglePermission}
                onToggleWildcard={handleToggleWildcard}
                onSelectAllIndividuals={handleSelectAllIndividuals}
              />
            ))}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !name}>
              {isSubmitting
                ? "Saving..."
                : isEditMode
                ? "Update Role"
                : "Create Role"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

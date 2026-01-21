import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { permissionsQueryOptions } from "@/utils/queries/permissions.queries";
import { rolesQueryOptions } from "@/utils/queries/roles.queries";
import { groupPermissionsByResource, Permission } from "@/types/permission.types";
import { UserWithPermissions, UpdateUserInput } from "@/types/user.types";
import { X, Plus, Shield } from "lucide-react";

interface UserFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserWithPermissions | null;
  onSubmit: (data: UpdateUserInput) => void;
  isSubmitting?: boolean;
}

export function UserForm({
  open,
  onOpenChange,
  user,
  onSubmit,
  isSubmitting,
}: UserFormProps) {
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [directPermissionIds, setDirectPermissionIds] = useState<string[]>([]);
  const [showPermissionPicker, setShowPermissionPicker] = useState(false);

  const { data: roles = [] } = useQuery(rolesQueryOptions());
  const { data: permissions = [] } = useQuery(permissionsQueryOptions());

  // Get permissions for selected role
  const selectedRole = roles.find((r) => r.id === selectedRoleId);
  const rolePermissionIds = selectedRole?.permissions.map((p) => p.id) || [];

  // Filter out permissions already in role
  const availablePermissions = permissions.filter(
    (p) => !rolePermissionIds.includes(p.id) && !directPermissionIds.includes(p.id)
  );

  // Reset form when user changes
  useEffect(() => {
    if (open && user) {
      setSelectedRoleId(user.roleId);
      setDirectPermissionIds(user.directPermissions?.map((p) => p.id) || []);
    }
  }, [open, user]);

  const handleAddPermission = (permissionId: string) => {
    setDirectPermissionIds((prev) => [...prev, permissionId]);
    setShowPermissionPicker(false);
  };

  const handleRemovePermission = (permissionId: string) => {
    setDirectPermissionIds((prev) => prev.filter((id) => id !== permissionId));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      roleId: selectedRoleId,
      directPermissionIds,
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getPermissionById = (id: string): Permission | undefined => {
    return permissions.find((p) => p.id === id);
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-h-[90vh] overflow-y-auto sm:!max-w-xl">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Update user role and additional permissions
          </DialogDescription>
        </DialogHeader>

        {/* User Info Header */}
        <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
          <Avatar className="h-14 w-14">
            <AvatarImage src={user.image || undefined} alt={user.name} />
            <AvatarFallback className="text-lg">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate">{user.name}</h3>
            <p className="text-sm text-muted-foreground truncate">{user.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Role Selection */}
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select value={selectedRoleId} onValueChange={setSelectedRoleId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.id} value={role.id}>
                    <div className="flex items-center gap-2">
                      <span>{role.name}</span>
                      {role.isSystem && (
                        <Badge variant="secondary" className="text-xs px-1 py-0">
                          System
                        </Badge>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedRole && (
              <p className="text-xs text-muted-foreground">
                {selectedRole.description}
              </p>
            )}
          </div>

          {/* Role Permissions Preview */}
          {selectedRole && selectedRole.permissions.length > 0 && (
            <div className="space-y-2">
              <Label className="text-muted-foreground text-xs uppercase tracking-wide">
                Role Permissions
              </Label>
              <div className="flex flex-wrap gap-1">
                {selectedRole.permissions.slice(0, 8).map((perm) => (
                  <Badge
                    key={perm.id}
                    variant="secondary"
                    className="text-xs font-normal"
                  >
                    {perm.name}
                  </Badge>
                ))}
                {selectedRole.permissions.length > 8 && (
                  <Badge variant="secondary" className="text-xs font-normal">
                    +{selectedRole.permissions.length - 8} more
                  </Badge>
                )}
              </div>
            </div>
          )}

          <Separator />

          {/* Direct Permissions */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label>Additional Permissions</Label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Extra permissions beyond the role
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowPermissionPicker(!showPermissionPicker)}
                disabled={availablePermissions.length === 0}
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                Add
              </Button>
            </div>

            {/* Permission Picker Dropdown */}
            {showPermissionPicker && availablePermissions.length > 0 && (
              <div className="border rounded-lg p-3 space-y-2 bg-muted/30">
                <p className="text-xs font-medium text-muted-foreground">
                  Select permission to add:
                </p>
                <div className="max-h-48 overflow-y-auto space-y-1">
                  {Object.entries(groupPermissionsByResource(availablePermissions)).map(
                    ([resource, perms]) => (
                      <div key={resource}>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide py-1">
                          {resource}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {perms.map((perm) => (
                            <Badge
                              key={perm.id}
                              variant="outline"
                              className="text-xs cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                              onClick={() => handleAddPermission(perm.id)}
                            >
                              {perm.action}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            {/* Selected Direct Permissions */}
            {directPermissionIds.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {directPermissionIds.map((id) => {
                  const perm = getPermissionById(id);
                  if (!perm) return null;
                  return (
                    <Badge
                      key={id}
                      variant="default"
                      className="text-xs font-normal pl-2 pr-1 py-1 gap-1"
                    >
                      <Shield className="h-3 w-3" />
                      {perm.name}
                      <button
                        type="button"
                        onClick={() => handleRemovePermission(id)}
                        className="ml-1 hover:bg-primary-foreground/20 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">
                No additional permissions assigned
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !selectedRoleId}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

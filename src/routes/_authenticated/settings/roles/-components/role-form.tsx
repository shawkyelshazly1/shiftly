import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, Shield } from "lucide-react";
import { PermissionGroup } from "@/components/permission-group";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { groupPermissionsByResource } from "@/types/permission.types";
import { CreateRoleInput, Role, UpdateRoleInput } from "@/types/role.types";
import { permissionsQueryOptions } from "@/utils/queries/permissions.queries";

const roleFormSchema = z.object({
  name: z.string().min(1, "Role name is required").max(50),
  description: z.string().max(500).optional(),
  permissionIds: z.array(z.string()),
});

type RoleFormValues = z.infer<typeof roleFormSchema>;

interface RoleFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role?: Role | null;
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
  const { data: permissions = [] } = useQuery(permissionsQueryOptions());
  const groupedPermissions = groupPermissionsByResource(permissions);
  const isEditMode = !!role;
  const isSystemRole = role?.isSystem;

  const form = useForm<RoleFormValues>({
    resolver: zodResolver(roleFormSchema),
    defaultValues: {
      name: "",
      description: "",
      permissionIds: [],
    },
  });

  useEffect(() => {
    if (open) {
      if (role) {
        form.reset({
          name: role.name,
          description: role.description || "",
          permissionIds: role.permissions.map((p) => p.id),
        });
      } else {
        form.reset({
          name: "",
          description: "",
          permissionIds: [],
        });
      }
    }
  }, [open, role, form]);

  const selectedPermissionIds = form.watch("permissionIds");

  const selectedCount = useMemo(() => {
    return selectedPermissionIds.length;
  }, [selectedPermissionIds]);

  const totalPermissions = useMemo(() => {
    return permissions.length;
  }, [permissions]);

  const handleTogglePermission = (permissionId: string) => {
    const current = form.getValues("permissionIds");
    const updated = current.includes(permissionId)
      ? current.filter((id) => id !== permissionId)
      : [...current, permissionId];
    form.setValue("permissionIds", updated);
  };

  const handleToggleWildcard = (wildcardId: string, individualIds: string[]) => {
    const current = form.getValues("permissionIds");
    const hasWildcard = current.includes(wildcardId);
    const updated = hasWildcard
      ? current.filter((id) => id !== wildcardId)
      : [...current.filter((id) => !individualIds.includes(id)), wildcardId];
    form.setValue("permissionIds", updated);
  };

  const handleSelectAllIndividuals = (wildcardId: string, individualIds: string[]) => {
    const current = form.getValues("permissionIds");
    const updated = [
      ...current.filter((id) => !individualIds.includes(id)),
      wildcardId,
    ];
    form.setValue("permissionIds", updated);
  };

  const handleSelectAll = () => {
    // Select all wildcard permissions (one per resource group)
    const wildcardIds = permissions
      .filter((p) => p.action === "all")
      .map((p) => p.id);
    form.setValue("permissionIds", wildcardIds);
  };

  const handleClearAll = () => {
    form.setValue("permissionIds", []);
  };

  const handleSubmit = (values: RoleFormValues) => {
    onSubmit({
      name: values.name,
      description: values.description || "",
      permissionIds: values.permissionIds,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full sm:!max-w-5xl p-4 sm:p-6">
        <DialogHeader>
          <div className="flex items-start sm:items-center gap-3">
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </div>
            <div className="min-w-0">
              <DialogTitle className="text-lg sm:text-xl">
                {isEditMode ? "Edit Role" : "Create New Role"}
              </DialogTitle>
              <DialogDescription className="mt-1 text-sm">
                Roles define what actions users can perform. Assign permissions to control access to features and data.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Left Column: Role Details */}
              <div className="space-y-6 lg:w-[320px] lg:shrink-0">
                {isSystemRole && (
                  <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-950/30">
                    <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-500" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                        System Role
                      </p>
                      <p className="text-sm text-amber-700 dark:text-amber-300/80">
                        This is a system-defined role. The role name cannot be changed, but you can modify its permissions.
                      </p>
                    </div>
                  </div>
                )}

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Team Lead"
                          disabled={isSystemRole}
                          {...field}
                        />
                      </FormControl>
                      {isSystemRole && (
                        <FormDescription>
                          System role names cannot be changed
                        </FormDescription>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe what this role is for and who should have it..."
                          rows={3}
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Help others understand when to assign this role
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Right Column: Permissions */}
              <div className="flex-1 min-w-0">
                <Card className="py-0 gap-0">
                  <CardHeader className="border-b pb-3 sm:pb-4 pt-3 sm:pt-4 px-3 sm:px-6">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <CardTitle className="text-sm sm:text-base">Permissions</CardTitle>
                        <Badge variant="secondary" className="font-normal text-xs">
                          {selectedCount} selected
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={handleSelectAll}
                          className="h-7 sm:h-8 text-xs px-2 sm:px-3"
                        >
                          Select All
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={handleClearAll}
                          className="h-7 sm:h-8 text-xs px-2 sm:px-3"
                          disabled={selectedCount === 0}
                        >
                          Clear All
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="max-h-[280px] sm:max-h-[320px] overflow-y-auto p-3 sm:p-4">
                      <div className="space-y-3">
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
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <DialogFooter className="flex-col-reverse gap-2 sm:flex-row sm:gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                {isSubmitting
                  ? "Saving..."
                  : isEditMode
                    ? "Update Role"
                    : "Create Role"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

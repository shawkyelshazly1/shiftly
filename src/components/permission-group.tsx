import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Permission } from "@/types/permission.types";

interface PermissionGroupProps {
  resource: string;
  permissions: Permission[];
  selectedIds: string[];
  onToggle: (permissionId: string) => void;
  onToggleWildcard: (wildcardId: string, individualIds: string[]) => void;
  onSelectAllIndividuals: (wildcardId: string, individualIds: string[]) => void;
}

export function PermissionGroup({
  resource,
  permissions,
  selectedIds,
  onToggle,
  onToggleWildcard,
  onSelectAllIndividuals,
}: PermissionGroupProps) {
  // Separate wildcard from individual permissions
  const wildcardPerm = permissions.find((p) => p.action === "all");
  const individualPerms = permissions.filter((p) => p.action !== "all");

  const wildcardSelected = wildcardPerm
    ? selectedIds.includes(wildcardPerm.id)
    : false;
  const individualIds = individualPerms.map((p) => p.id);

  // Count only individual permissions (exclude wildcard)
  const selectedIndividualCount = individualIds.filter((id) =>
    selectedIds.includes(id)
  ).length;
  const totalIndividualCount = individualIds.length;
  const allIndividualsSelected =
    selectedIndividualCount === totalIndividualCount;

  // Format resource name for display
  const formatResourceName = (name: string) => {
    return name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, " ");
  };

  // Format action name for display
  const formatActionName = (action: string) => {
    return action.charAt(0).toUpperCase() + action.slice(1);
  };

  const handleWildcardToggle = () => {
    if (wildcardPerm) {
      onToggleWildcard(wildcardPerm.id, individualIds);
    }
  };

  const handleIndividualToggle = (permissionId: string) => {
    // Check if this toggle would select all individuals
    const wouldSelectAll =
      !selectedIds.includes(permissionId) &&
      selectedIndividualCount === totalIndividualCount - 1;

    if (wouldSelectAll && wildcardPerm) {
      // Auto-switch to wildcard
      onSelectAllIndividuals(wildcardPerm.id, individualIds);
    } else {
      onToggle(permissionId);
    }
  };

  return (
    <div className="rounded-lg border p-4">
      <div className="flex items-center gap-3 mb-3 pb-3 border-b">
        {wildcardPerm ? (
          <>
            <Checkbox
              id={`wildcard-${resource}`}
              checked={wildcardSelected}
              onCheckedChange={handleWildcardToggle}
            />
            <Label
              htmlFor={`wildcard-${resource}`}
              className="text-sm font-semibold cursor-pointer"
            >
              {formatResourceName(resource)}
            </Label>
            <span className="text-xs text-muted-foreground ml-auto">
              {wildcardSelected
                ? `${totalIndividualCount}/${totalIndividualCount}`
                : `${selectedIndividualCount}/${totalIndividualCount}`}
            </span>
          </>
        ) : (
          <>
            <Label className="text-sm font-semibold">
              {formatResourceName(resource)}
            </Label>
            <span className="text-xs text-muted-foreground ml-auto">
              {selectedIndividualCount}/{totalIndividualCount}
            </span>
          </>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {individualPerms.map((permission) => (
          <div key={permission.id} className="flex items-center gap-2">
            <Checkbox
              id={permission.id}
              checked={wildcardSelected || selectedIds.includes(permission.id)}
              disabled={wildcardSelected}
              onCheckedChange={() => handleIndividualToggle(permission.id)}
            />
            <Label
              htmlFor={permission.id}
              className={`text-sm cursor-pointer ${
                wildcardSelected
                  ? "text-muted-foreground/50"
                  : "text-muted-foreground"
              }`}
            >
              {formatActionName(permission.action)}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
}

import { memo } from "react";
import {
  Check,
  MoreVertical,
  Pencil,
  Shield,
  ShieldCheck,
  Star,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Role } from "@/types/role.types";

interface RoleCardProps {
  role: Role;
  onEdit: (role: Role) => void;
  onDelete: (role: Role) => void;
}

export const RoleCard = memo(function RoleCard({
  role,
  onEdit,
  onDelete,
}: RoleCardProps) {
  // Group permissions by resource for better display
  const permissionsByResource = role.permissions.reduce(
    (acc, perm) => {
      const resource = perm.resource;
      if (!acc[resource]) {
        acc[resource] = [];
      }
      acc[resource].push(perm);
      return acc;
    },
    {} as Record<string, typeof role.permissions>
  );

  const resourceCount = Object.keys(permissionsByResource).length;
  const displayResources = Object.keys(permissionsByResource).slice(0, 4);
  const remainingCount = resourceCount - displayResources.length;

  return (
    <Card
      className="group relative py-5 transition-all duration-200 hover:shadow-md hover:border-primary/20 cursor-pointer"
      onClick={() => onEdit(role)}
    >
      <CardHeader className="p-0 px-4 sm:px-5 pb-4">
        <div className="flex items-start justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div
              className={`flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg transition-colors ${
                role.isSystem
                  ? "bg-amber-500/10 text-amber-600 dark:text-amber-500"
                  : "bg-primary/10 text-primary"
              }`}
            >
              {role.isSystem ? (
                <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5" />
              ) : (
                <Shield className="h-4 w-4 sm:h-5 sm:w-5" />
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <CardTitle className="text-sm sm:text-base font-medium truncate">
                  {role.name}
                </CardTitle>
                {role.isDefault && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <Star className="h-3 w-3 text-primary fill-primary" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>Default role for new users</TooltipContent>
                  </Tooltip>
                )}
              </div>
              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                {role.isSystem && (
                  <Badge
                    variant="secondary"
                    className="text-xs px-2 py-0 h-5 bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20 hover:bg-amber-500/10"
                  >
                    System
                  </Badge>
                )}
                <span className="text-xs text-muted-foreground">
                  {role.permissions.length} permission
                  {role.permissions.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(role);
                }}
              >
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(role);
                }}
                disabled={role.isSystem}
                className="text-destructive focus:text-destructive focus:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="p-0 px-4 sm:px-5 space-y-4">
        <CardDescription className="line-clamp-2 text-sm leading-relaxed">
          {role.description || "No description provided for this role."}
        </CardDescription>

        {role.permissions.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Access Areas
            </p>
            <div className="flex flex-wrap gap-1.5">
              {displayResources.map((resource) => (
                <Tooltip key={resource}>
                  <TooltipTrigger asChild>
                    <Badge
                      variant="outline"
                      className="text-xs font-normal px-2 sm:px-2.5 py-0.5 capitalize bg-muted/50 hover:bg-muted transition-colors"
                    >
                      {resource.replace(/-/g, " ")}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-xs">
                    <p className="font-medium capitalize mb-1">
                      {resource.replace(/-/g, " ")}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {permissionsByResource[resource].map((perm) => (
                        <span
                          key={perm.id}
                          className="inline-flex items-center gap-1 text-xs"
                        >
                          <Check className="h-3 w-3 text-emerald-500" />
                          {perm.action}
                        </span>
                      ))}
                    </div>
                  </TooltipContent>
                </Tooltip>
              ))}
              {remainingCount > 0 && (
                <Badge
                  variant="outline"
                  className="text-xs font-normal px-2 sm:px-2.5 py-0.5 bg-muted/50"
                >
                  +{remainingCount} more
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
});

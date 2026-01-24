import { Plus, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RolesPageHeaderProps {
  onCreateClick: () => void;
}

export function RolesPageHeader({ onCreateClick }: RolesPageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Shield className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="font-semibold text-2xl tracking-tight">
              Roles & Permissions
            </h1>
            <p className="text-muted-foreground text-sm">
              Define access levels and capabilities for your team
            </p>
          </div>
        </div>
      </div>
      <Button onClick={onCreateClick} className="gap-2 shadow-sm">
        <Plus className="h-4 w-4" />
        Create Role
      </Button>
    </div>
  );
}

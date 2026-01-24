import { memo } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Role } from "@/types/role.types";
import { RoleCard } from "./role-card";

interface RolesGridProps {
  roles: Role[];
  onEdit: (role: Role) => void;
  onDelete: (role: Role) => void;
}

export const RolesGrid = memo(function RolesGrid({ roles, onEdit, onDelete }: RolesGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {roles.map((role) => (
        <RoleCard key={role.id} role={role} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
});

export function RolesGridSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="py-5">
          <CardHeader className="p-0 px-4 sm:px-5 pb-4">
            <div className="flex items-start justify-between gap-2 sm:gap-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <Skeleton className="h-9 w-9 sm:h-10 sm:w-10 rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20 sm:w-24" />
                  <Skeleton className="h-3 w-14 sm:w-16" />
                </div>
              </div>
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          </CardHeader>
          <CardContent className="p-0 px-4 sm:px-5">
            <Skeleton className="h-3 w-full mb-4" />
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-6 w-14 sm:w-16 rounded-full" />
              <Skeleton className="h-6 w-16 sm:w-20 rounded-full" />
              <Skeleton className="h-6 w-12 sm:w-14 rounded-full" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

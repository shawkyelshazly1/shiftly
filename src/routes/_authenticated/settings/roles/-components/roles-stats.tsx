import { Key, Lock, Shield, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface RolesStatsProps {
  totalRoles: number;
  systemRoles: number;
  customRoles: number;
  totalPermissions: number;
  isLoading: boolean;
}

export function RolesStats({
  totalRoles,
  systemRoles,
  customRoles,
  totalPermissions,
  isLoading,
}: RolesStatsProps) {
  const stats = [
    {
      label: "Total Roles",
      value: totalRoles,
      icon: Shield,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "System Roles",
      value: systemRoles,
      icon: Lock,
      color: "text-amber-600 dark:text-amber-500",
      bgColor: "bg-amber-500/10",
    },
    {
      label: "Custom Roles",
      value: customRoles,
      icon: Users,
      color: "text-emerald-600 dark:text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
    {
      label: "Permissions Used",
      value: totalPermissions,
      icon: Key,
      color: "text-violet-600 dark:text-violet-500",
      bgColor: "bg-violet-500/10",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="py-4">
          <CardContent className="flex items-center gap-4 p-0 px-4">
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${stat.bgColor}`}
            >
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <div className="min-w-0">
              <p className="text-sm text-muted-foreground truncate">
                {stat.label}
              </p>
              {isLoading ? (
                <Skeleton className="h-7 w-12 mt-0.5" />
              ) : (
                <p className="text-2xl font-semibold tracking-tight">
                  {stat.value}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

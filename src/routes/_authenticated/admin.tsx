import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Users,
  Shield,
  UsersRound,
  Mail,
  ArrowRight,
  Settings,
  Plus,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useUsersCount } from "@/hooks/useUsers";
import { useTeamsCount } from "@/hooks/useTeams";
import { useRoles } from "@/hooks/useRoles";
import { useInvitations } from "@/hooks/useInvitations";
import Can from "@/components/can";
import { PERMISSIONS } from "@/constants/permissions";
import { usePermissions } from "@/hooks/usePermissions";
import { currentUserPermissionQueryOptions } from "@/utils/auth.permissions.query";
import { requireAnyPermission } from "@/utils/routes.utils";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminDashboardPage,
  beforeLoad: async ({ context }) => {
    const { permissions } = await context.queryClient.ensureQueryData(
      currentUserPermissionQueryOptions()
    );

    requireAnyPermission(
      [
        PERMISSIONS.USERS_ALL,
        PERMISSIONS.TEAMS_ALL,
        PERMISSIONS.ROLES_ALL,
        PERMISSIONS.SETTINGS_ALL,
      ],
      { permissions }
    );

    return { auth: context.auth };
  },
});

function AdminDashboardPage() {
  return (
    <div className="flex-1 flex flex-col gap-6 p-4 sm:p-6">
      <WelcomeHeader />
      <StatsSection />
      <div className="grid gap-6 lg:grid-cols-2">
        <QuickActions />
        <RecentActivity />
      </div>
    </div>
  );
}

function WelcomeHeader() {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div>
      <h1 className="font-semibold text-2xl">{getGreeting()}</h1>
      <p className="text-muted-foreground text-sm mt-1">
        Here's an overview of your workforce management.
      </p>
    </div>
  );
}

function StatsSection() {
  const { data: usersCount, isLoading: usersLoading } = useUsersCount();
  const { data: teamsCount, isLoading: teamsLoading } = useTeamsCount();
  const { data: roles, isLoading: rolesLoading } = useRoles();
  const { data: invitations, isLoading: invitationsLoading } = useInvitations();
  const { canAny } = usePermissions();

  const rolesList = Array.isArray(roles) ? roles : [];
  const invitationsList = Array.isArray(invitations) ? invitations : [];

  const pendingInvitations = invitationsList.filter(
    (i) => i.status === "pending"
  ).length;

  const hasAnyStatsPermission = canAny(
    PERMISSIONS.USERS_READ,
    PERMISSIONS.USERS_ALL,
    PERMISSIONS.TEAMS_READ,
    PERMISSIONS.TEAMS_ALL,
    PERMISSIONS.ROLES_READ,
    PERMISSIONS.ROLES_ALL
  );

  if (!hasAnyStatsPermission) {
    return null;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Can permission={PERMISSIONS.USERS_READ}>
        <StatCard
          title="Total Users"
          value={usersLoading ? undefined : String(usersCount?.total ?? 0)}
          description={usersLoading ? undefined : `${usersCount?.verified ?? 0} verified`}
          icon={Users}
          href="/settings/users"
          loading={usersLoading}
        />
      </Can>
      <Can permission={PERMISSIONS.TEAMS_READ}>
        <StatCard
          title="Teams"
          value={teamsLoading ? undefined : String(teamsCount?.total ?? 0)}
          description="Active teams"
          icon={UsersRound}
          href="/settings/teams"
          loading={teamsLoading}
        />
      </Can>
      <Can permission={PERMISSIONS.ROLES_READ}>
        <StatCard
          title="Roles"
          value={rolesLoading ? undefined : String(rolesList.length)}
          description="Defined roles"
          icon={Shield}
          href="/settings/roles"
          loading={rolesLoading}
        />
      </Can>
      <Can permission={PERMISSIONS.USERS_READ}>
        <StatCard
          title="Pending Invitations"
          value={invitationsLoading ? undefined : String(pendingInvitations)}
          description={
            invitationsLoading ? undefined : `${invitationsList.length} total`
          }
          icon={Mail}
          href="/settings/users"
          loading={invitationsLoading}
          highlight={pendingInvitations > 0}
        />
      </Can>
    </div>
  );
}

function StatCard({
  title,
  value,
  description,
  icon: Icon,
  href,
  loading,
  highlight,
}: {
  title: string;
  value?: string;
  description?: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  loading?: boolean;
  highlight?: boolean;
}) {
  return (
    <Link to={href}>
      <Card
        className={`hover:shadow-md transition-shadow cursor-pointer ${
          highlight ? "border-primary/50" : ""
        }`}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Icon
            className={`h-4 w-4 ${
              highlight ? "text-primary" : "text-muted-foreground"
            }`}
          />
        </CardHeader>
        <CardContent>
          {loading ? (
            <>
              <Skeleton className="h-8 w-16 mb-1" />
              <Skeleton className="h-4 w-24" />
            </>
          ) : (
            <>
              <div className="text-2xl font-bold">{value}</div>
              <p className="text-xs text-muted-foreground">{description}</p>
            </>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

function QuickActions() {
  const { canAny } = usePermissions();

  const hasAnyQuickActionPermission = canAny(
    PERMISSIONS.USERS_CREATE,
    PERMISSIONS.TEAMS_ALL,
    PERMISSIONS.ROLES_CREATE,
    PERMISSIONS.SETTINGS_READ
  );

  if (!hasAnyQuickActionPermission) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Quick Actions</CardTitle>
        <CardDescription>Common tasks and shortcuts</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2">
        <Can permission={PERMISSIONS.USERS_CREATE}>
          <QuickActionButton
            icon={Plus}
            label="Add User"
            description="Invite a new team member"
            href="/settings/users"
          />
        </Can>
        <Can permission={PERMISSIONS.TEAMS_ALL}>
          <QuickActionButton
            icon={UsersRound}
            label="Create Team"
            description="Set up a new team"
            href="/settings/teams"
          />
        </Can>
        <Can permission={PERMISSIONS.ROLES_CREATE}>
          <QuickActionButton
            icon={Shield}
            label="Manage Roles"
            description="Configure permissions"
            href="/settings/roles"
          />
        </Can>
        <Can permission={PERMISSIONS.SETTINGS_READ}>
          <QuickActionButton
            icon={Settings}
            label="Settings"
            description="Configure your workspace"
            href="/settings"
          />
        </Can>
      </CardContent>
    </Card>
  );
}

function QuickActionButton({
  icon: Icon,
  label,
  description,
  href,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  description: string;
  href: string;
}) {
  return (
    <Link to={href}>
      <Button
        variant="outline"
        className="w-full h-auto p-4 justify-start gap-3 hover:bg-accent cursor-pointer"
      >
        <div className="rounded-lg bg-primary/10 p-2">
          <Icon className="h-4 w-4 text-primary" />
        </div>
        <div className="text-left">
          <div className="font-medium">{label}</div>
          <div className="text-xs text-muted-foreground">{description}</div>
        </div>
      </Button>
    </Link>
  );
}

function RecentActivity() {
  const { data: invitations, isLoading } = useInvitations();
  const invitationsList = Array.isArray(invitations) ? invitations : [];

  // Show recent pending invitations as activity
  const recentInvitations = invitationsList
    .filter((i) => i.status === "pending")
    .slice(0, 5);

  return (
    <Can permission={PERMISSIONS.USERS_READ}>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">Pending Invitations</CardTitle>
            <CardDescription>
              Users awaiting invitation acceptance
            </CardDescription>
          </div>
          {recentInvitations.length > 0 && (
            <Link to="/settings/users">
              <Button variant="ghost" size="sm" className="cursor-pointer">
                View all <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          )}
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-32 mb-1" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                </div>
              ))}
            </div>
          ) : recentInvitations.length > 0 ? (
            <div className="space-y-3">
              {recentInvitations.map((invitation) => (
                <div key={invitation.id} className="flex items-center gap-3">
                  <div className="rounded-full bg-yellow-500/10 p-2">
                    <Mail className="h-4 w-4 text-yellow-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                      {invitation.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {invitation.email}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(invitation.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Mail className="h-8 w-8 text-muted-foreground/50 mb-2" />
              <p className="text-sm text-muted-foreground">
                No pending invitations
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </Can>
  );
}

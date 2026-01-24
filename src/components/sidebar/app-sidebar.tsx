import { Link } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Calendar,
  CalendarDays,
  Users,
  UsersRound,
  Shield,
  Settings,
} from "lucide-react";
import { PERMISSIONS } from "@/constants/permissions";
import Can from "@/components/can";
import { Sidebar } from "./sidebar";
import { SidebarItem } from "./sidebar-item";
import { SidebarSection, SidebarGroup } from "./sidebar-section";
import { SidebarUser } from "./sidebar-user";
import { useSidebar } from "./sidebar-context";
import Logo from "@/assets/logo.horizontal.svg?react";
import LogoIcon from "@/assets/logo-icon.svg?react";

export function AppSidebar() {
  const { isCollapsed } = useSidebar();

  return (
    <Sidebar
      header={
        <Link to="/" className="flex items-center">
          {isCollapsed ? (
            <LogoIcon className="h-8 w-8" />
          ) : (
            <Logo className="h-8 w-auto text-sidebar-foreground" />
          )}
        </Link>
      }
      footer={<SidebarUser />}
    >
      <SidebarGroup>
        {/* Admin Dashboard */}
        <SidebarItem to="/" label="Dashboard" icon={LayoutDashboard} />

        {/* Schedule Section */}
        <Can
          any={[
            PERMISSIONS.OWN_SCHEDULE_VIEW,
            PERMISSIONS.OWN_SCHEDULE_REQUEST,
          ]}
        >
          <SidebarSection title="Schedule">
            <SidebarItem
              to="/schedule/me"
              label="My Schedule"
              icon={Calendar}
            />
            <Can permission={PERMISSIONS.SWAPS_APPROVE}>
              <SidebarItem
                to="/schedule/team"
                label="Team Schedule"
                icon={CalendarDays}
              />
            </Can>
          </SidebarSection>
        </Can>

        {/* Settings Section (consolidated Admin + Manage) */}
        <Can
          any={[
            PERMISSIONS.USERS_ALL,
            PERMISSIONS.TEAMS_ALL,
            PERMISSIONS.ROLES_ALL,
            PERMISSIONS.SETTINGS_ALL,
          ]}
        >
          <SidebarSection title="Settings">
            <Can
              any={[
                PERMISSIONS.USERS_ALL,
                PERMISSIONS.TEAMS_ALL,
                PERMISSIONS.ROLES_ALL,
                PERMISSIONS.SETTINGS_ALL,
              ]}
            >
              <SidebarItem to="/admin" label="Admin" icon={LayoutDashboard} />
            </Can>
            <Can permission={PERMISSIONS.USERS_ALL}>
              <SidebarItem to="/settings/users" label="Users" icon={Users} />
            </Can>
            <Can permission={PERMISSIONS.TEAMS_ALL}>
              <SidebarItem
                to="/settings/teams"
                label="Teams"
                icon={UsersRound}
              />
            </Can>
            <Can permission={PERMISSIONS.ROLES_ALL}>
              <SidebarItem to="/settings/roles" label="Roles" icon={Shield} />
            </Can>
            <Can permission={PERMISSIONS.SETTINGS_ALL}>
              <SidebarItem
                to="/settings/general"
                label="General"
                icon={Settings}
              />
            </Can>
          </SidebarSection>
        </Can>
      </SidebarGroup>
    </Sidebar>
  );
}

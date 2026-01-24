import { Link } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useSidebar } from "./sidebar-context";
import { SidebarUser } from "./sidebar-user";
import { SidebarItem } from "./sidebar-item";
import { SidebarSection, SidebarGroup } from "./sidebar-section";
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
import Logo from "@/assets/logo.horizontal.svg?react";

export function MobileSidebarTrigger() {
  const { openMobile } = useSidebar();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={openMobile}
      className="md:hidden h-9 w-9"
      aria-label="Open navigation menu"
    >
      <Menu className="h-5 w-5" />
    </Button>
  );
}

export function MobileSidebar() {
  const { isMobileOpen, closeMobile } = useSidebar();

  return (
    <Sheet open={isMobileOpen} onOpenChange={closeMobile}>
      <SheetContent side="left" className="w-72 p-0" showCloseButton={false}>
        <SheetHeader className="border-b border-sidebar-border px-4 py-3">
          <SheetTitle asChild>
            <Link to="/" onClick={closeMobile} className="flex items-center">
              <Logo className="h-8 w-auto text-foreground" />
            </Link>
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-[calc(100%-57px)]">
          {/* Navigation */}
          <div className="flex-1 overflow-y-auto px-3 py-4">
            <SidebarGroup>
              {/* Dashboard */}
              <SidebarItem to="/" label="Dashboard" icon={LayoutDashboard} end onClick={closeMobile} />

              {/* Schedule Section */}
              <Can any={[PERMISSIONS.OWN_SCHEDULE_VIEW, PERMISSIONS.OWN_SCHEDULE_REQUEST]}>
                <SidebarSection title="Schedule">
                  <SidebarItem to="/schedule/me" label="My Schedule" icon={Calendar} onClick={closeMobile} />
                  <Can permission={PERMISSIONS.SWAPS_APPROVE}>
                    <SidebarItem to="/schedule/team" label="Team Schedule" icon={CalendarDays} onClick={closeMobile} />
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
                  <Can permission={PERMISSIONS.USERS_ALL}>
                    <SidebarItem to="/settings/users" label="Users" icon={Users} onClick={closeMobile} />
                  </Can>
                  <Can permission={PERMISSIONS.TEAMS_ALL}>
                    <SidebarItem to="/settings/teams" label="Teams" icon={UsersRound} onClick={closeMobile} />
                  </Can>
                  <Can permission={PERMISSIONS.ROLES_ALL}>
                    <SidebarItem to="/settings/roles" label="Roles" icon={Shield} onClick={closeMobile} />
                  </Can>
                  <Can permission={PERMISSIONS.SETTINGS_ALL}>
                    <SidebarItem to="/settings/general" label="General" icon={Settings} onClick={closeMobile} />
                  </Can>
                </SidebarSection>
              </Can>
            </SidebarGroup>
          </div>

          {/* Footer */}
          <div className="border-t border-sidebar-border p-3">
            <SidebarUser />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

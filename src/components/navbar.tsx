import { Link, useMatchRoute } from "@tanstack/react-router";
import Logo from "../assets/logo.horizontal.svg?react";
import Can from "./can";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { cn } from "@/lib/utils";
import LogoutButton from "./logout-button";
import { PERMISSIONS } from "@/constants/permissions";

export default function Navbar() {
  return (
    <div className="w-full bg-gray-800 py-1 h-[10%]">
      <div className="flex flex-row container mx-auto items-center">
        <Link to="/" className="cursor-pointer">
          <Logo className="w-30" color="white" />
        </Link>
        <Can
          any={[PERMISSIONS.ROLES_ALL, PERMISSIONS.SETTINGS_ALL]}
          children={<AdminRoutes />}
        />
        <Can
          any={[
            PERMISSIONS.OWN_SCHEDULE_REQUEST,
            PERMISSIONS.OWN_SCHEDULE_VIEW,
          ]}
          children={<ScheduleRoutes />}
        />
        <Can
          any={[
            PERMISSIONS.USERS_ALL,
            PERMISSIONS.TEAMS_ALL,
            PERMISSIONS.SCHEDULES_ALL,
          ]}
          children={<ManageRoutes />}
        />

        <LogoutButton classStyles="ml-auto bg-red-400 font-semibold cursor-pointer hover:bg-red-500" />
      </div>
    </div>
  );
}

function AdminRoutes() {
  const matchAdminRoute = useMatchRoute();
  const isMatching = matchAdminRoute({ to: "/admin", fuzzy: true });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className={cn(
            !isMatching && "bg-transparent text-gray-300",
            isMatching && "text-white bg-gray-900",
            "cursor-pointer hover:text-white"
          )}
        >
          Admin
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <Link
          to="/admin/roles"
          className="hover:not-[&.active]:*:focus:bg-gray-200 [&.active]:*:bg-gray-900 [&.active]:*:text-white *:cursor-pointer "
        >
          <DropdownMenuItem className="">Roles</DropdownMenuItem>
        </Link>
        <Link
          to="/admin/settings"
          className="hover:not-[&.active]:*:focus:bg-gray-200 [&.active]:*:bg-gray-900 [&.active]:*:text-white *:cursor-pointer "
        >
          <DropdownMenuItem className="">Settings</DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ScheduleRoutes() {
  const matchingSchedule = useMatchRoute();
  const isMatching = matchingSchedule({ to: "/schedule", fuzzy: true });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className={cn(
            !isMatching && "bg-transparent text-gray-300",
            isMatching && "text-white bg-gray-900",
            "cursor-pointer hover:text-white"
          )}
        >
          Schedule
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <Link
          to="/schedule/me"
          className="hover:not-[&.active]:*:focus:bg-gray-200 [&.active]:*:bg-gray-900 [&.active]:*:text-white *:cursor-pointer "
        >
          <DropdownMenuItem className="">My Schedule</DropdownMenuItem>
        </Link>
        <Can
          any={["swaps:approve"]}
          children={
            <Link
              to="/schedule/team"
              className="hover:not-[&.active]:*:focus:bg-gray-200 [&.active]:*:bg-gray-900 [&.active]:*:text-white *:cursor-pointer "
            >
              <DropdownMenuItem className=" ">Team schedule</DropdownMenuItem>
            </Link>
          }
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ManageRoutes() {
  const matchingSchedule = useMatchRoute();
  const isMatching = matchingSchedule({ to: "/manage", fuzzy: true });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className={cn(
            !isMatching && "bg-transparent text-gray-300",
            isMatching && "text-white bg-gray-900",
            "cursor-pointer hover:text-white"
          )}
        >
          Manage
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <Can
          permission="users:*"
          children={
            <Link
              to="/manage/users"
              className="hover:not-[&.active]:*:focus:bg-gray-200 [&.active]:*:bg-gray-900 [&.active]:*:text-white *:cursor-pointer "
            >
              <DropdownMenuItem className="">Users</DropdownMenuItem>
            </Link>
          }
        />
        <Can
          permission="teams:*"
          children={
            <Link
              to="/manage/teams"
              className="hover:not-[&.active]:*:focus:bg-gray-200 [&.active]:*:bg-gray-900 [&.active]:*:text-white *:cursor-pointer "
            >
              <DropdownMenuItem className="">Teams</DropdownMenuItem>
            </Link>
          }
        />

        <Can
          any={["schedules:*"]}
          children={
            <Link
              to="/manage/schedule"
              className="hover:not-[&.active]:*:focus:bg-gray-200 [&.active]:*:bg-gray-900 [&.active]:*:text-white *:cursor-pointer "
            >
              <DropdownMenuItem className=" ">Schedules</DropdownMenuItem>
            </Link>
          }
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

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

export default function Navbar() {
  return (
    <div className="w-full bg-gray-800 py-1">
      <div className="flex flex-row container mx-auto items-center">
        <Link to="/" className="cursor-pointer">
          <Logo className="w-30" color="white" />
        </Link>
        <Can permission="*" children={<AdminRoutes />} />
        
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
          to="/admin/permissions"
          className="hover:not-[&.active]:*:focus:bg-gray-200 [&.active]:*:bg-gray-900 [&.active]:*:text-white *:cursor-pointer "
        >
          <DropdownMenuItem className=" ">Permissions</DropdownMenuItem>
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

import { Link, useMatchRoute } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useSidebar } from "./sidebar-context";
import type { LucideIcon } from "lucide-react";

type SidebarItemProps = {
  to: string;
  label: string;
  icon: LucideIcon;
  end?: boolean;
  onClick?: () => void;
};

export function SidebarItem({ to, label, icon: Icon, end = false, onClick }: SidebarItemProps) {
  const { isCollapsed } = useSidebar();
  const matchRoute = useMatchRoute();
  const isActive = matchRoute({ to, fuzzy: !end });

  const content = (
    <Link
      to={to}
      onClick={onClick}
      className={cn(
        "relative flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
        "transition-all duration-200 ease-out",
        "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground hover:scale-[1.02]",
        isActive && "bg-sidebar-accent text-sidebar-foreground",
        isActive && "before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-5 before:w-1 before:rounded-r-full before:bg-primary",
        isCollapsed && "justify-center px-2"
      )}
    >
      <Icon className="h-5 w-5 shrink-0" />
      {!isCollapsed && <span>{label}</span>}
    </Link>
  );

  if (isCollapsed) {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent side="right" className="font-medium">
          {label}
        </TooltipContent>
      </Tooltip>
    );
  }

  return content;
}

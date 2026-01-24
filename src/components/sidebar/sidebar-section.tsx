import { cn } from "@/lib/utils";
import { useSidebar } from "./sidebar-context";
import type { ReactNode } from "react";

type SidebarSectionProps = {
  title: string;
  children: ReactNode;
};

export function SidebarSection({ title, children }: SidebarSectionProps) {
  const { isCollapsed } = useSidebar();

  return (
    <div className="space-y-1">
      {!isCollapsed && (
        <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/50">
          {title}
        </h3>
      )}
      {isCollapsed && <div className="my-2 border-t border-sidebar-border" />}
      <nav className="space-y-1">{children}</nav>
    </div>
  );
}

type SidebarGroupProps = {
  children: ReactNode;
  className?: string;
};

export function SidebarGroup({ children, className }: SidebarGroupProps) {
  return <div className={cn("space-y-4", className)}>{children}</div>;
}

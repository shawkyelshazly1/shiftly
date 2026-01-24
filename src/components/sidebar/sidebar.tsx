import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSidebar } from "./sidebar-context";
import type { ReactNode } from "react";

type SidebarProps = {
  children: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
};

export function Sidebar({ children, header, footer }: SidebarProps) {
  const { isCollapsed, toggle } = useSidebar();

  return (
    <aside
      className={cn(
        "relative hidden md:flex h-screen flex-col bg-sidebar border-r border-sidebar-border shadow-sm transition-all duration-300 ease-in-out",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Toggle Button - positioned at edge */}
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            onClick={toggle}
            className={cn(
              "absolute -right-3 top-6 z-10 h-6 w-6 rounded-full border bg-background shadow-md",
              "text-muted-foreground hover:text-foreground hover:bg-accent",
              "transition-transform duration-200 hover:scale-110"
            )}
          >
            {isCollapsed ? (
              <ChevronRight className="h-3 w-3" />
            ) : (
              <ChevronLeft className="h-3 w-3" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          {isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        </TooltipContent>
      </Tooltip>

      {/* Header */}
      <div className={cn(
        "flex h-14 items-center border-b border-sidebar-border",
        isCollapsed ? "justify-center px-2" : "px-4"
      )}>
        {header}
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-4">{children}</div>

      {/* Footer */}
      {footer && (
        <div className="border-t border-sidebar-border p-3">{footer}</div>
      )}
    </aside>
  );
}

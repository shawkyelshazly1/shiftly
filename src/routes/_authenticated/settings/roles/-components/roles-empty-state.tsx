import { Plus, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface RolesEmptyStateProps {
  hasSearch: boolean;
  onCreateClick: () => void;
}

export function RolesEmptyState({ hasSearch, onCreateClick }: RolesEmptyStateProps) {
  return (
    <Card className="py-16">
      <CardContent className="flex flex-col items-center justify-center text-center p-0">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
          <Shield className="h-8 w-8 text-muted-foreground" />
        </div>
        {hasSearch ? (
          <>
            <h3 className="text-lg font-medium">No roles found</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              No roles match your search. Try adjusting your search terms.
            </p>
          </>
        ) : (
          <>
            <h3 className="text-lg font-medium">No roles yet</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              Get started by creating your first role to define access levels
              for your team.
            </p>
            <Button onClick={onCreateClick} className="mt-6 gap-2">
              <Plus className="h-4 w-4" />
              Create Role
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}

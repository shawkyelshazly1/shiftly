import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TeamWithMembers, CreateTeamInput, UpdateTeamInput } from "@/types/team.types";

const teamFormSchema = z.object({
  name: z.string().min(1, "Team name is required").max(100).transform(val => val.trim().toLowerCase()),
  description: z.string().max(500).optional(),
});

type TeamFormValues = z.infer<typeof teamFormSchema>;

interface TeamFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  team: TeamWithMembers | null;
  onSubmit: (data: CreateTeamInput | UpdateTeamInput) => void;
  isSubmitting: boolean;
}

export function TeamForm({ open, onOpenChange, team, onSubmit, isSubmitting }: TeamFormProps) {
  const isMobile = useMediaQuery("(max-width: 640px)");
  const isEditing = !!team;

  const form = useForm<TeamFormValues>({
    resolver: zodResolver(teamFormSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  useEffect(() => {
    if (team) {
      form.reset({
        name: team.name,
        description: team.description || "",
      });
    } else {
      form.reset({
        name: "",
        description: "",
      });
    }
  }, [team, form]);

  const handleSubmit = (values: TeamFormValues) => {
    onSubmit({
      name: values.name,
      description: values.description || undefined,
    });
  };

  const formFields = (
    <>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Team Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter team name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Enter team description (optional)"
                className="resize-none"
                rows={3}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );

  const footer = (
    <>
      <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
        Cancel
      </Button>
      <Button type="submit" form="team-form" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : isEditing ? "Save Changes" : "Create Team"}
      </Button>
    </>
  );

  // Mobile: Use Sheet
  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="bottom" className="h-auto max-h-[85vh] flex flex-col" showCloseButton={false}>
          <SheetHeader>
            <SheetTitle>{isEditing ? "Edit Team" : "Create Team"}</SheetTitle>
            <SheetDescription>
              {isEditing
                ? "Update the team details below."
                : "Fill in the details to create a new team."}
            </SheetDescription>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto -mx-4 px-4">
            <Form {...form}>
              <form id="team-form" onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-4">
                {formFields}
              </form>
            </Form>
          </div>
          <SheetFooter className="flex-row gap-2 pt-4">
            {footer}
          </SheetFooter>
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop: Use Dialog
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Team" : "Create Team"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the team details below."
              : "Fill in the details to create a new team."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form id="team-form" onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {formFields}
            <DialogFooter>
              {footer}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

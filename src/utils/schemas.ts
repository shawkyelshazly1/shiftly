import z from "zod";

export const createRoleSchema = z.object({
  name: z.string().min(2).max(255),
  description: z.string().min(2).max(255),
  permissionIds: z.array(z.uuid()).optional(),
});



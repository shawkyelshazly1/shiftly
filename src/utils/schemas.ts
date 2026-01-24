import z from "zod";

export const createRoleSchema = z.object({
  name: z.string().min(2).max(255),
  description: z.string().min(2).max(255),
  permissionIds: z
    .array(z.uuid())
    .min(1, { error: "Choose 1 permission at least." }),
});

export const createUserSchema = z.object({
  name: z.string().min(2).max(255),
  email: z.email(),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .max(128, { message: "Password cannot exceed 128 characters" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

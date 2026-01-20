import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth.client";
import { currentUserPermissionQueryOptions } from "@/utils/auth.permissions.query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const loginFormSchema = z.object({
  email: z.email({ error: "Email address is required" }),
  password: z
    .string({ error: "Password is required" })
    .min(5, { message: "Password must be at least 5 characters long" })
    .max(12, { message: "Password cannot be longer than 12 characters" }),
});

export default function LoginForm({
  redirectTo = "/",
}: {
  redirectTo: string | undefined;
}) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  // login form wrapper
  const loginForm = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // submit function
  function onSubmit(values: z.infer<typeof loginFormSchema>) {
    authClient.signIn.email({
      ...values,
      fetchOptions: {
        onError: ({ error }) => {
          toast.error(error.message);
        },
        onSuccess: async () => {
          await queryClient.fetchQuery(currentUserPermissionQueryOptions());

          navigate({ to: redirectTo });
        },
      },
    });

    // authClient.signUp.email({
    //   ...values,
    //   name: "shawky",
    //   fetchOptions: {
    //     onError: ({ error }) => {
    //       toast.error(error.message);
    //     },
    //   },
    // });
  }

  return (
    <>
      <Form {...loginForm}>
        <form
          onSubmit={loginForm.handleSubmit(onSubmit)}
          className="flex flex-col gap-4 container w-3/4 sm:w-2/4 md:w-2/5 lg:w-1/4 px-6"
        >
          <FormField
            control={loginForm.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="example@company.com"
                    required
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={loginForm.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="*******"
                    {...field}
                    required
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Login</Button>
        </form>
      </Form>
    </>
  );
}

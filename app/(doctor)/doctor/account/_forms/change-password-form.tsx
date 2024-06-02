"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { useState } from "react";
import { EyeIcon, EyeOffIcon, Loader } from "lucide-react";
import { updateDoctorPassword } from "@/helper/doctorActions";
import { weakPassword } from "@/components/data/week-passwords";

const FormSchema = z
  .object({
    id: z.number(),
    currentPassword: z
      .string()
      .min(8, {
        message: "Password must be at least 8 characters.",
      })
      .max(32, {
        message: "Password must be less than 32 characters.",
      }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
        {
          message:
            "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
        }
      )
      .refine(
        (value) => {
          // Check for common weak passwords
          const commonWeakPasswords = weakPassword;
          return !commonWeakPasswords.includes(value.toLowerCase());
        },
        {
          message:
            "Password is too common or weak, please choose a stronger one",
        }
      ),
    confirmPassword: z
      .string()
      .min(8, {
        message: "Password must be at least 8 characters.",
      })
      .max(32, {
        message: "Password must be less than 32 characters.",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export default function ChangeDoctorPasswordForm({ data }: any) {
  const [isPasswordUpdating, setIsPasswordUpdating] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      id: data?.id,
      currentPassword: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsPasswordUpdating(true);

    const res = await updateDoctorPassword(data);
    if (res.status === 200) {
      toast.success("Password updated successfully");
      form.reset();
    } else if (res.status === 401) {
      toast.warning("Current password is incorrect");
    } else {
      toast.error("Something went wrong");
    }

    setIsPasswordUpdating(false);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
        <CardDescription>
          Enter your current password and set a new one.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid lg:grid-cols-2 gap-4 items-end">
            <FormField
              disabled={isPasswordUpdating}
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Enter your current password"
                        {...field}
                        type={showPass ? "text" : "password"}
                      />
                      <Button
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center justify-center w-10 h-full text-gray-500"
                        size="icon"
                        variant="ghost"
                        onClick={() => setShowPass(!showPass)}>
                        {showPass ? (
                          <EyeOffIcon className="w-5 h-5" />
                        ) : (
                          <EyeIcon className="w-5 h-5" />
                        )}
                        <span className="sr-only">
                          Toggle password visibility
                        </span>
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              disabled={isPasswordUpdating}
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="New password"
                        {...field}
                        type={showPass ? "text" : "password"}
                      />
                      <Button
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center justify-center w-10 h-full text-gray-500"
                        size="icon"
                        variant="ghost"
                        onClick={() => setShowPass(!showPass)}>
                        {showPass ? (
                          <EyeOffIcon className="w-5 h-5" />
                        ) : (
                          <EyeIcon className="w-5 h-5" />
                        )}
                        <span className="sr-only">
                          Toggle password visibility
                        </span>
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              disabled={isPasswordUpdating}
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Confirm password"
                        {...field}
                        type={showPass ? "text" : "password"}
                      />
                      <Button
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center justify-center w-10 h-full text-gray-500"
                        size="icon"
                        variant="ghost"
                        onClick={() => setShowPass(!showPass)}>
                        {showPass ? (
                          <EyeOffIcon className="w-5 h-5" />
                        ) : (
                          <EyeIcon className="w-5 h-5" />
                        )}
                        <span className="sr-only">
                          Toggle password visibility
                        </span>
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              disabled={isPasswordUpdating}
              type="submit"
              className="w-full mt-6 lg:col-span-2">
              {isPasswordUpdating ? (
                <Loader className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Update"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

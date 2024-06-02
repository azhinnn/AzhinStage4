"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  EyeIcon,
  EyeOffIcon,
  Loader,
  Lock,
  MailCheck,
  ShieldCheck,
} from "lucide-react";
import loginImg from "@/public/login-img.svg";
import { sendResetPasswordEmail } from "@/helper/emailActions/sendResetPasswordEmail";
import { weakPassword } from "@/components/data/week-passwords";
import { resetPassword } from "@/helper/emailActions/resetPassword";

const FormSchema = z
  .object({
    token: z.string(),
    email: z.string(),
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
      .min(8, { message: "Password must be at least 8 characters" })
      .max(32, { message: "Password must be less than 32 characters" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function ResetPasswordForm({
  token,
  email,
}: {
  token: string;
  email: string;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email,
      token,
    },
  });

  const router = useRouter();

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true);

    const res = await resetPassword(data);

    if (res.success) {
      setSuccess(true);
    } else {
      toast.error(res.error);
    }

    setIsLoading(false);
  }

  return success ? (
    <div className="w-full grid min-h-[400px] items-center lg:grid-cols-2 lg:min-h-0 lg:gap-0">
      <div className="hidden lg:flex lg:items-center lg:justify-center lg:py-12 p-16 pr-0">
        <Image
          alt="Image"
          className="h-full w-full object-cover rounded-xl"
          height="400"
          src={loginImg}
          style={{
            aspectRatio: "600/400",
            objectFit: "cover",
          }}
          width="600"
        />
      </div>
      <div className="mx-auto w-[350px] space-y-8 text-center">
        <div className="space-y-4 flex flex-col items-center text-center ">
          <ShieldCheck className="h-20 w-20" />
          <h1 className="text-3xl font-bold">Password Reseted</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Password reseted successfully. You can now login with the new
            password!
          </p>
        </div>
        <Button asChild className="w-32">
          <Link href={"/login"}>Login</Link>
        </Button>
      </div>
    </div>
  ) : (
    <div className="w-full grid min-h-[400px] items-center lg:grid-cols-2 lg:min-h-0 lg:gap-0">
      <div className="hidden lg:flex lg:items-center lg:justify-center lg:py-12 p-16 pr-0">
        <Image
          alt="Image"
          className="h-full w-full object-cover rounded-xl"
          height="400"
          src={loginImg}
          style={{
            aspectRatio: "600/400",
            objectFit: "cover",
          }}
          width="600"
        />
      </div>
      <div className="w-full grid items-center py-12 lg:py-0">
        <div className="mx-auto w-[350px] space-y-6">
          <div className="space-y-3 text-center flex flex-col items-center">
            <Lock className="h-20 w-20" />
            <h1 className="text-3xl font-bold">Reset Password</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Enter your new password
            </p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                disabled={isLoading}
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Enter new password"
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
                disabled={isLoading}
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Enter new password again"
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

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Reset"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}

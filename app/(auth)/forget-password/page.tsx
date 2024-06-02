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
import { Loader, Lock, MailCheck } from "lucide-react";
import loginImg from "@/public/login-img.svg";
import { sendResetPasswordEmail } from "@/helper/emailActions/sendResetPasswordEmail";

const FormSchema = z.object({
  email: z.string().min(2, {
    message: "must be at least 2 characters.",
  }),
});

export default function Page() {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
    },
  });

  const router = useRouter();

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true);
    const res = await sendResetPasswordEmail(data?.email);

    if (res.success) {
      setSuccess(true);
    } else {
      toast.warning(res.error);
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
          <MailCheck className="h-20 w-20" />
          <h1 className="text-3xl font-bold">Email Sent!</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Please check your email and click on the link to reset your
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
              Enter your email and we will send you a link to reset your
              password
            </p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                disabled={isLoading}
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter email"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Send"
                )}
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            Back to
            <Link className="underline ml-1 text-primary" href="/login">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

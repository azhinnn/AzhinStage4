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
import { EyeIcon, EyeOffIcon, Loader } from "lucide-react";
import { loginUser } from "@/helper/authActions";
import loginImg from "@/public/login-img.svg";

const FormSchema = z.object({
  email: z.string().min(2, {
    message: "must be at least 2 characters.",
  }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .max(32, { message: "Password must be less than 32 characters" }),
});

export default function Page() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const router = useRouter();

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true);
    const res = await loginUser(data);

    if (res.status === 200) {
      toast.success("Login successful");
      router.push(`/${res.data.type}/dashboard`);
    } else if (res.status === 404) {
      setIsLoading(false);
      toast.warning("Invalid credentials");
    } else if (res.status === 401) {
      setIsLoading(false);
      toast.warning("Email not verified", {
        description: (
          <div className="dark:text-white">
            Please check your email and verify your account!
          </div>
        ),
      });
    } else {
      setIsLoading(false);
      toast.error("Something went wrong");
    }
  }

  return (
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
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Login</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Login to your account
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
                    <FormLabel>Email or Phone Number</FormLabel>
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

              <FormField
                disabled={isLoading}
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex justify-between">
                      Password{" "}
                      <Link
                        className="text-muted-foreground underline"
                        href={"/forget-password"}>
                        Forget password
                      </Link>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="*****"
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
                  "Login"
                )}
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?
            <Link className="underline ml-1 text-primary" href="/signup">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

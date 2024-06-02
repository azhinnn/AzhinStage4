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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import Image from "next/image";
import { useState } from "react";
import { EyeIcon, EyeOffIcon, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import loginImg from "@/public/login-img.svg";
import { signupUser } from "@/helper/authActions";
import { weakPassword } from "@/components/data/week-passwords";

const FormSchema = z
  .object({
    name: z.string().min(2, {
      message: "name must be at least 2 characters.",
    }),
    phone: z
      .string()
      .min(11, { message: "Phone number must be 11 Numbers." })
      .max(11, { message: "Phone number must be 11 Numbers." })
      .refine((value) => /^(075|077|078)\d{8}$/.test(value), {
        message: "Phone number must start with 075, 077, or 078.",
      }),
    email: z.string().optional(),
    gender: z.string({
      required_error: "gender is required",
    }),
    age: z.string().min(1, {
      message: "age must be at least 1.",
    }),
    city: z.string({
      required_error: "city is required",
    }),
    street: z.string().min(2, {
      message: "street must be at least 2 characters.",
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
      .min(8, { message: "Password must be at least 8 characters" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine((data) => Number(data.age) <= 120, {
    message: "Age must be less than or equal to 120",
    path: ["age"],
  });

export default function SignupForm({ cities }: any) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      gender: "",
      age: "",
      city: "",
      street: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true);
    const res = await signupUser(data);

    if (res.status === 200) {
      toast.success("Account created successfully");
      router.push("/login");
    } else if (res.status === 409) {
      toast.warning("Account already exists", {
        description: (
          <div className="text-white">
            Account already exists with <b>Phone Number</b> or <b>Email</b>!
          </div>
        ),
      });
      setIsLoading(false);
    } else {
      toast.error("Failed to create account");
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full grid items-center py-12 lg:py-0">
      <div className="mx-auto w-[350px] space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Signup</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Create your account.
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              disabled={isLoading}
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              disabled={isLoading}
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter phone number"
                      {...field}
                      type="number"
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Email{" "}
                    <span className="text-muted-foreground text-xs">
                      (Optional)
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter email"
                      {...field}
                      value={field.value || ""}
                      type="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-2 items-end">
              <FormField
                disabled={isLoading}
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem className="w-1/2">
                    <FormLabel>Gender</FormLabel>
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="notSelected">
                          Not selected
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                disabled={isLoading}
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem className="w-1/2">
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter age" {...field} type="number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex gap-2 justify-between">
              <FormField
                disabled={isLoading}
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem className="w-1/2">
                    <FormLabel>City</FormLabel>
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      defaultValue={field.value || ""}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select City" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {cities.map((city: any) => (
                          <SelectItem key={city.id} value={city.id.toString()}>
                            {city.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                disabled={isLoading}
                control={form.control}
                name="street"
                render={({ field }) => (
                  <FormItem className="w-1/2">
                    <FormLabel>Street</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter street" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
                        placeholder="Enter password"
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
            <Button disabled={isLoading} type="submit" className="w-full">
              {isLoading ? (
                <Loader className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
        </Form>
        <div className="mt-4 text-center text-sm">
          Already have an account?
          <Link className="underline ml-1 text-primary" href="/login">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

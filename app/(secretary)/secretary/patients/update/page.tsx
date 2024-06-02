"use client";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Suspense, useEffect, useState } from "react";
import { EyeIcon, EyeOffIcon, Loader } from "lucide-react";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import {
  getPatient,
  updatePatient,
  updatePatientPassword,
} from "@/helper/patientActions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Link from "next/link";
import { getCities } from "@/helper/cityActions";
import { weakPassword } from "@/components/data/week-passwords";

const patientFormSchema = z
  .object({
    id: z.number(),
    name: z.string().min(2).max(50),
    phone: z
      .string()
      .min(11)
      .max(11)
      .refine((value) => /^(075|077|078)\d{8}$/.test(value), {
        message: "Phone number must start with 075, 077, or 078.",
      }),
    email: z.string().email().min(2).max(50).nullable().optional(),
    gender: z.string(),
    age: z.string(),
    city: z.string().optional().nullable(),
    street: z.string().min(2).max(50).nullable().optional(),
    image: z.string().optional().nullable(),
    description: z.string().optional().nullable(),
  })
  .refine((data) => Number(data.age) <= 120, {
    message: "Age must be less than or equal to 120",
    path: ["age"],
  });

const newPasswordSchema = z
  .object({
    id: z.number(),
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

export default function Page() {
  return (
    <Suspense
      fallback={
        <div>
          <Loader className="w-5 h-5 animate-spin" />
        </div>
      }>
      <ChildComponent />
    </Suspense>
  );
}

function ChildComponent() {
  const params = useSearchParams().get("id");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isPasswordUpdating, setIsPasswordUpdating] = useState(false);
  const [isPasswordFormOpen, setIsPasswordFormOpen] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [cities, setCities] = useState([]);

  const form = useForm<z.infer<typeof patientFormSchema>>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: {
      id: Number(params),
      name: "",
      phone: "",
      email: "",
      gender: "",
      age: "",
      city: "",
      street: "",
      image: "",
      description: "",
    },
  });

  const newPasswordForm = useForm<z.infer<typeof newPasswordSchema>>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: {
      id: Number(params),
      password: "",
      confirmPassword: "",
    },
  });

  // load the data from the database when page loaded 👇
  useEffect(() => {
    async function fetchDate() {
      const { data } = await getPatient(Number(params));

      // change age to string
      data.age = data.age.toString();
      form.reset({
        city: data.City?.id.toString(),
        ...data,
      });
      // get cities
      const { data: cities } = await getCities();
      setCities(cities);

      setIsLoading(false);
    }
    fetchDate();
  }, []);

  // a function to update the data of the patient in the database 👇
  async function onSubmit(values: z.infer<typeof patientFormSchema>) {
    setIsUpdating(true);

    const res = await updatePatient(values);

    if (res.status === 409) {
      toast.error("Email or Phone already exists!", {
        description: (
          <div className="dark:text-white">
            Please choose a different <b>Email</b> or <b>Phone</b>
          </div>
        ),
      });
      setIsUpdating(false);
      return;
    }
    if (res.status !== 200) {
      toast.error("Something went wrong");
      setIsUpdating(false);
      return;
    }
    toast.success("Patient updated successfully");
    router.push("/secretary/patients");
  }

  // a function to update the password of the patient in the database 👇
  async function onChangePassword(values: z.infer<typeof newPasswordSchema>) {
    setIsPasswordUpdating(true);

    const res = await updatePatientPassword(values);

    if (res.status !== 200) {
      toast.error("Something went wrong");
      setIsPasswordUpdating(false);
      return;
    }

    newPasswordForm.reset();
    toast.success("Password updated successfully");
    setIsPasswordFormOpen(false);
    setIsPasswordUpdating(false);
  }

  return isLoading ? (
    <div className="container h-full grid place-items-center">
      <Loader className="w-5 h-5 animate-spin" />
    </div>
  ) : (
    <>
      <div className="space-y-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/secretary/patients">
                Patients
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Update Patient</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Card>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <CardHeader>
                <CardTitle>Update Patient</CardTitle>
                <CardDescription>Update Patient information.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid lg:grid-cols-3  gap-2 lg:gap-4">
                  <FormField
                    disabled={isUpdating}
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
                    disabled={isUpdating}
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
                  <FormField
                    disabled={isUpdating}
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter phone" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid lg:grid-cols-4 gap-2 lg:gap-4">
                  <FormField
                    disabled={isUpdating}
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Age</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter age"
                            {...field}
                            type="number"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <Select
                          disabled={isUpdating}
                          onValueChange={field.onChange}
                          value={field.value}>
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
                    disabled={isUpdating}
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <Select
                          disabled={isUpdating}
                          defaultValue={form.getValues("city") || ""}
                          onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={"Select City"} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {cities?.map((city: any) => (
                              <SelectItem
                                key={city.id}
                                value={city.id.toString()}>
                                {city.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          You can manage cities in{" "}
                          <Link
                            href="/secretary/settings"
                            className="underline">
                            Settings Page
                          </Link>
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    disabled={isUpdating}
                    control={form.control}
                    name="street"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Street</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter Street"
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
              <CardFooter className="gap-4">
                <Button type="submit" disabled={isUpdating} className="w-full">
                  {isUpdating ? (
                    <Loader className="w-5 h-5 animate-spin" />
                  ) : (
                    "Update Patient"
                  )}
                </Button>
                <Button
                  type="button"
                  variant={"destructive"}
                  onClick={() => {
                    setIsPasswordFormOpen(true);
                  }}>
                  Set New Password
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>

      {/* change password dialog 👇 */}
      <Dialog open={isPasswordFormOpen} onOpenChange={setIsPasswordFormOpen}>
        <DialogContent onPointerDownOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Change Patient Password</DialogTitle>
            <DialogDescription>
              Are you sure you want to change password of this patient?
            </DialogDescription>
          </DialogHeader>
          <Form {...newPasswordForm}>
            <form
              className="space-y-8"
              onSubmit={newPasswordForm.handleSubmit(onChangePassword)}>
              <div className="space-y-4">
                <FormField
                  disabled={isPasswordUpdating}
                  control={newPasswordForm.control}
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
                  control={newPasswordForm.control}
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
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant={"outline"}
                  onClick={() => setIsPasswordFormOpen(false)}
                  disabled={isPasswordUpdating}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isPasswordUpdating}>
                  {isPasswordUpdating ? (
                    <Loader className="w-5 h-5 animate-spin" />
                  ) : (
                    "Change Password"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}

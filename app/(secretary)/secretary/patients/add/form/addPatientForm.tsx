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
import { useState } from "react";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { addPatient } from "@/helper/patientActions";
import { toast } from "sonner";

const patientFormSchema = z
  .object({
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
    street: z.string().min(2).max(50).optional().nullable(),
    image: z.string().optional().nullable(),
    description: z.string().optional().nullable(),
  })
  .refine((data) => Number(data.age) <= 120, {
    message: "Age must be less than or equal to 120",
    path: ["age"],
  });

export default function AddPatientForm({ cities }: any) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof patientFormSchema>>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: {
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

  // a function to add the data of the patient in the database 👇
  async function onSubmit(values: z.infer<typeof patientFormSchema>) {
    setIsLoading(true);
    const res = await addPatient(values);

    if (res.status === 409) {
      toast.warning("Email or Phone already exists!", {
        description: (
          <div className="dark:text-white">
            Please choose a different <b>Email</b> or <b>Phone</b>
          </div>
        ),
      });
      setIsLoading(false);
      return;
    }
    if (res.status !== 200) {
      toast.error("Something went wrong");
      setIsLoading(false);
      return;
    }
    toast.success("Patient added successfully");
    router.push("/secretary/patients");
  }

  return (
    <div className="space-y-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/secretary/patients">Patients</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Add Patient</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Card>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <CardHeader>
              <CardTitle>Add Patient</CardTitle>
              <CardDescription>Add Patient information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid lg:grid-cols-3  gap-2 lg:gap-4">
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
                  disabled={isLoading}
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
                  disabled={isLoading}
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
                        disabled={isLoading}
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
                  disabled={isLoading}
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <Select
                        disabled={isLoading}
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
                        <Link href="/secretary/settings" className="underline">
                          Settings Page
                        </Link>
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  disabled={isLoading}
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
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <Loader className="w-5 h-5 animate-spin" />
                ) : (
                  "Add Patient"
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}

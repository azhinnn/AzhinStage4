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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader } from "lucide-react";
import { UpdateDoctor } from "@/helper/doctorActions";
import { useRouter } from "next/navigation";

const FormSchema = z.object({
  id: z.number(),
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email(),
  phone: z
    .string()
    .min(11)
    .max(11)
    .refine((value) => /^(075|077|078)\d{8}$/.test(value), {
      message: "Phone number must start with 075, 077, or 078.",
    }),
  city: z.string({ required_error: "city is required" }),
  street: z.string().min(2, {
    message: "street must be at least 2 characters.",
  }),
  gender: z.string({
    required_error: "gender is required",
  }),
});

export default function ChangeDoctorDetailForm({ data, cities }: any) {
  const router = useRouter();
  const [isDetailUpadting, setIsDetailUpadting] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      id: data?.id,
      name: data?.name,
      email: data?.email,
      phone: data?.phone,
      city: data?.City?.id.toString(),
      street: data?.street,
      gender: data?.gender,
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsDetailUpadting(true);

    const res = await UpdateDoctor({ data });

    if (res.status === 409) {
      toast.error("Email or Phone already exists!", {
        description: (
          <div className="dark:text-white">
            Please choose a different <b>Email</b> or <b>Phone</b>
          </div>
        ),
      });
      return;
    }
    if (res.status !== 200) {
      toast.error("Something went wrong");
      return;
    }
    toast.success("Doctor updated successfully");
    router.refresh();
    setIsDetailUpadting(false);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>Update your personal information.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid lg:grid-cols-2 gap-4 items-end">
            <FormField
              disabled={isDetailUpadting}
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              disabled={isDetailUpadting}
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your email"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              disabled={isDetailUpadting}
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your phone"
                      {...field}
                      type="number"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              disabled={isDetailUpadting}
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <Select
                    disabled={isDetailUpadting}
                    onValueChange={field.onChange}
                    defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="notSelected">Not Selected</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              disabled={isDetailUpadting}
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <Select
                    disabled={isDetailUpadting}
                    defaultValue={form.getValues("city") || ""}
                    onValueChange={(value) => {
                      field.onChange(value);
                    }}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={"Select City"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {cities?.map((city: any) => (
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
              disabled={isDetailUpadting}
              control={form.control}
              name="street"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Street</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your street"
                      {...field}
                      type="text"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={isDetailUpadting}
              type="submit"
              className="w-full mt-6 lg:col-span-2">
              {isDetailUpadting ? (
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

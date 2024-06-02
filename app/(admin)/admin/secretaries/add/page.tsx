"use client";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEdgeStore } from "@/lib/edgestore";
import { Loader } from "lucide-react";
import { addSecretary } from "@/helper/secretaryActions";

const secretaryFormSchema = z.object({
  name: z.string().min(2).max(50),
  phone: z
    .string()
    .min(11)
    .max(11)
    .refine((value) => /^(075|077|078)\d{8}$/.test(value), {
      message: "Phone number must start with 075, 077, or 078.",
    }),
  email: z.string().email().min(2).max(50),
  gender: z.string({
    required_error: "Please select a Gender.",
  }),
  image: z.string().optional().nullable(),
});

export default function Page() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof secretaryFormSchema>>({
    resolver: zodResolver(secretaryFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      image: "",
    },
  });

  const [file, setFile] = useState<File>();
  const { edgestore } = useEdgeStore();

  async function handleImageUpload() {
    if (file) {
      const res = await edgestore.publicFiles.upload({
        file,
        options: form.getValues("image")
          ? { replaceTargetUrl: form.getValues("image")! }
          : {},
      });
      return res;
    }
  }

  async function onSubmit(values: z.infer<typeof secretaryFormSchema>) {
    setIsLoading(true);
    const imgRes = await handleImageUpload();

    const data = await addSecretary({
      ...values,
      image: imgRes?.url,
    });

    if (data.status === 409) {
      toast.error("Secretary already exist!", {
        description: (
          <div className="dark:text-white">
            Another secretary already exist with this <b>Phone Number</b> or{" "}
            <b>Email</b>
          </div>
        ),
      });
    } else if (data.status !== 200) {
      toast.error("Something went wrong");
    } else {
      toast.success("secretary added successfully");
      router.push("/admin/secretaries");
    }

    setIsLoading(false);
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/secretaries">
              Secretarys
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Add Secretary</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Card>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <CardHeader>
              <CardTitle>Add Profile</CardTitle>
              <CardDescription>Update profile information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center flex-col gap-4 space-x-4">
                <Avatar className="w-24 h-24 aspect-square border">
                  <AvatarImage
                    src={
                      file
                        ? URL.createObjectURL(file)
                        : form.getValues("image") || ""
                    }
                  />
                  <AvatarFallback>
                    {form.getValues("name")?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <Button
                  asChild
                  className="px-8"
                  size={"sm"}
                  disabled={isLoading}>
                  <Label>
                    Upload
                    <Input
                      type="file"
                      onChange={(e) => setFile(e.target.files?.[0])}
                      className="hidden"
                      disabled={isLoading}
                    />
                  </Label>
                </Button>
              </div>

              <div className="space-y-2 grid lg:grid-cols-2 items-end lg:gap-4 gap-2">
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
                        <Input placeholder="Enter phone number" {...field} />
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
                        <Input placeholder="Enter email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
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
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Add secretary"
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}

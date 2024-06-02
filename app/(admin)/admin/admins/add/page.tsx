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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import { addAdmin } from "@/helper/adminActions";
import { Loader } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useEdgeStore } from "@/lib/edgestore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

const adminFormSchema = z.object({
  name: z.string().min(2).max(50),
  phone: z
    .string()
    .min(11)
    .max(11)
    .refine((value) => /^(075|077|078)\d{8}$/.test(value), {
      message: "Phone number must start with 075, 077, or 078.",
    }),
  email: z.string().min(2).max(50).email(),
  image: z.string().optional().nullable(),
});

export default function Page() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof adminFormSchema>>({
    resolver: zodResolver(adminFormSchema),
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

  async function onSubmit(values: z.infer<typeof adminFormSchema>) {
    setIsLoading(true);

    const imgRes = await handleImageUpload();

    const res = await addAdmin({ ...values, image: imgRes?.url });

    if (res.status === 200) {
      toast.success("Admin added successfully");
      router.push("/admin/admins");
    } else if (res.status === 409) {
      toast.error("Admin already exists!", {
        description: (
          <div className="dark:text-white">
            Admin already exists with <b>Phone Number</b> or <b>Email</b>.
          </div>
        ),
      });
      setIsLoading(false);
    } else {
      setIsLoading(false);
      toast.error("Failed to add admin");
    }
  }

  return (
    <div className="space-y-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/admins">Admins</BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Add Admin</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Card>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <CardHeader>
              <CardTitle>Add Admin Profile</CardTitle>
              <CardDescription>Add Admin profile information.</CardDescription>
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
                    />
                  </Label>
                </Button>
              </div>
              <div className="space-y-2">
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
              </div>
              <div className="space-y-2">
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
              </div>
              <div className="space-y-2">
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
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading} className="w-32">
                {isLoading ? (
                  <Loader className="w-5 h-5 animate-spin" />
                ) : (
                  "Add Admin"
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}

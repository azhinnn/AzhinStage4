"use client";
import {
  CardTitle,
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
import { Suspense, useEffect, useState } from "react";
import { getAdmin, updateAdmin, updateAdminImage } from "@/helper/adminActions";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useEdgeStore } from "@/lib/edgestore";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Loader } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const adminFormSchema = z.object({
  id: z.number(),
  name: z.string().min(2).max(50),
  phone: z
    .string()
    .min(11)
    .max(11)
    .refine((value) => /^(075|077|078)\d{8}$/.test(value), {
      message: "Phone number must start with 075, 077, or 078.",
    }),
  email: z.string().min(2).max(50),
  image: z.string().optional().nullable(),
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
  const [isUpdating, setIsUpdating] = useState(false);
  const params = useSearchParams().get("id");
  const router = useRouter();

  const form = useForm<z.infer<typeof adminFormSchema>>({
    resolver: zodResolver(adminFormSchema),
    defaultValues: {
      id: Number(params),
      name: "",
      phone: "",
      email: "",
      image: "",
    },
  });

  async function getAdminData() {
    const { data } = await getAdmin(params);

    form.reset({
      id: data?.id,
      name: data?.name,
      phone: data?.phone,
      email: data?.email,
      image: data?.image,
    });
  }

  useEffect(() => {
    getAdminData();
  }, []);

  async function onSubmit(values: z.infer<typeof adminFormSchema>) {
    setIsUpdating(true);
    const res = await updateAdmin(values);

    if (res.status === 200) {
      toast.success("Admin updated successfully");
      router.push("/admin/admins");
    } else if (res.status === 409) {
      toast.error("Phone or Email already exists!", {
        description: (
          <div className="dark:text-white">
            Admin already exists with <b>Phone Number</b> or <b>Email</b>.
          </div>
        ),
      });
      setIsUpdating(false);
    } else {
      toast.error("Failed to update admin");
      setIsUpdating(false);
    }
  }

  // image uploading
  const [file, setFile] = useState<File>();
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const { edgestore } = useEdgeStore();

  async function handleImageUpload() {
    if (file) {
      setIsUploading(true);
      const res = await edgestore.publicFiles.upload({
        file,
        options: form.getValues("image")
          ? { replaceTargetUrl: form.getValues("image")! }
          : {},
        onProgressChange: (progress) => {
          setProgress(progress);
        },
      });
      await updateAdminImage({
        id: params,
        image: res.url,
      });

      setProgress(0);
      setIsUploading(false);
      setFile(undefined);
      getAdminData();

      toast.success("Image Updated successfully");
    }
  }

  return (
    <div>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/admins">Admins</BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Edit Admin</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card className="border-0">
        <CardHeader>
          <CardTitle>Edit Profile Picture</CardTitle>
        </CardHeader>
      </Card>

      <Card className="border-0">
        <CardContent className="flex flex-col items-center gap-4">
          <Avatar className="w-24 h-24 aspect-square">
            <AvatarImage
              src={
                file ? URL.createObjectURL(file) : form.getValues("image") || ""
              }
            />
            <AvatarFallback>
              {form.getValues("name")?.charAt(0) || ""}
            </AvatarFallback>
          </Avatar>

          {isUploading && <Progress value={progress} className="w-full" />}

          {file ? (
            <div className="w-80 flex gap-4">
              <Button
                disabled={isUploading}
                className="w-full"
                onClick={() => setFile(undefined)}
                variant={"outline"}>
                Cancel
              </Button>
              <Button
                disabled={isUploading}
                className="w-full"
                onClick={handleImageUpload}>
                {isUploading ? <Loader className="animate-spin" /> : "Upload"}
              </Button>
            </div>
          ) : (
            <Button asChild className="px-8" disabled={isUploading}>
              <Label>
                Upload{" "}
                <Input
                  type="file"
                  onChange={(e) => setFile(e.target.files?.[0])}
                  className="hidden"
                />
              </Label>
            </Button>
          )}
        </CardContent>
      </Card>

      <Separator className="my-8" />

      <Card className="border-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <CardHeader>
              <CardTitle>Edit Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isUpdating}
                          placeholder="Enter name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isUpdating}
                          placeholder="Enter phone number"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isUpdating}
                          placeholder="Enter email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isUpdating}>
                {isUpdating ? (
                  <Loader className="w-5 h-5 animate-spin" />
                ) : (
                  "Update"
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}

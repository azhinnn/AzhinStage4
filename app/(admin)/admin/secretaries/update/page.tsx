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
import { Suspense, useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { EyeIcon, EyeOffIcon, Loader } from "lucide-react";
import { useEdgeStore } from "@/lib/edgestore";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  getSecretary,
  updateSecretary,
  updateSecretaryImage,
  updateSecretaryPassword,
} from "@/helper/secretaryActions";
import { weakPassword } from "@/components/data/week-passwords";

const SecretaryFormSchema = z.object({
  id: z.number(),
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

  const form = useForm<z.infer<typeof SecretaryFormSchema>>({
    resolver: zodResolver(SecretaryFormSchema),
    defaultValues: {
      id: Number(params),
      name: "",
      email: "",
      phone: "",
      image: "",
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

  useEffect(() => {
    async function fetchData() {
      // get Secretary detail
      const { data } = await getSecretary(params);

      form.reset({
        ...data,
      });
    }
    fetchData();

    setIsLoading(false);
  }, []);

  async function onSubmit(values: z.infer<typeof SecretaryFormSchema>) {
    setIsUpdating(true);
    const data = await updateSecretary(values);

    if (data.status === 200) {
      toast.success("Secretary updated successfully");
      router.push("/admin/secretaries");
    } else if (data.status === 409) {
      toast.error("Phone Number or Email already exist", {
        description: (
          <div className="dark:text-white">
            Another Secretary already exist with this <b>Phone Number</b> or{" "}
            <b>Email</b>
          </div>
        ),
      });
    } else {
      setIsUpdating(false);
      toast.error("Failed to update Secretary");
    }
    setIsUpdating(false);
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
      const resp = await updateSecretaryImage({
        id: params,
        image: res.url,
      });

      setProgress(0);
      setIsUploading(false);
      setFile(undefined);

      toast.success("Image Updated successfully");
    }
  }

  async function onChangePassword(values: z.infer<typeof newPasswordSchema>) {
    setIsPasswordUpdating(true);
    const res = await updateSecretaryPassword(values);

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
    <div className="container h-full flex items-center justify-center">
      <Loader className="w-5 h-5 animate-spin" />
    </div>
  ) : (
    <>
      <div className="space-y-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/secretaries">
                Secretaries
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Edit Secretary</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Card>
          <CardHeader>
            <CardTitle>Edit Profile Picture</CardTitle>
            <CardDescription>Upload profile picture</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <Avatar className="w-24 h-24 aspect-square">
              <AvatarImage
                src={
                  file
                    ? URL.createObjectURL(file)
                    : form.getValues("image") || ""
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
              <Button asChild className="px-8">
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
        <Card>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <CardHeader>
                <CardTitle>Edit Secretary Details</CardTitle>
                <CardDescription>Update profile information.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 grid lg:grid-cols-2 items-end lg:gap-4 gap-2">
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
                    disabled={isUpdating}
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
                </div>
              </CardContent>
              <CardFooter className="gap-4">
                <Button type="submit" className="w-full" disabled={isUpdating}>
                  {isUpdating ? (
                    <Loader className="w-5 h-5 animate-spin" />
                  ) : (
                    "Update"
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

      {/* Dialog for change Secretary password 👇 */}
      <Dialog open={isPasswordFormOpen} onOpenChange={setIsPasswordFormOpen}>
        <DialogContent onPointerDownOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Change Secretary Password</DialogTitle>
            <DialogDescription>
              Are you sure you want to change password of this Secretary?
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

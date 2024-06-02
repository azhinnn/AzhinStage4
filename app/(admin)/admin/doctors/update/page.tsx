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
import { Suspense, useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { getDoctorFields } from "@/helper/doctorFieldActions";
import { getDoctorTypeList } from "@/helper/doctorTypeActions";
import { Checkbox } from "@/components/ui/checkbox";
import {
  GetDoctor,
  UpdateDoctor,
  updateDoctorImage,
  updateDoctorPassword,
} from "@/helper/doctorActions";
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
import { Icon } from "@iconify/react/dist/iconify.js";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getCities } from "@/helper/cityActions";
import { weakPassword } from "@/components/data/week-passwords";

const doctorFormSchema = z.object({
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
  image: z.string().optional().nullable(),
  city: z.string().nullable(),
  street: z.string().nullable(),
  gender: z.string({ required_error: "Please select a Gender." }),
  doctorFieldId: z.string({ required_error: "doctor field is required" }),
  doctorTypeIds: z
    .array(z.string())
    .refine((value) => value.some((item) => item), {
      message: "You have to select at least one item.",
    }),

  DoctorType: z
    .object({
      id: z.number(),
      name: z.string(),
    })
    .array(),

  DoctorField: z.object({
    id: z.number(),
    name: z.string(),
  }),
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
  const [doctorFields, setDoctorFields] = useState([]);
  const [doctorTypes, setDoctorTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isPasswordUpdating, setIsPasswordUpdating] = useState(false);
  const [isPasswordFormOpen, setIsPasswordFormOpen] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [cities, setCities] = useState([]);

  const form = useForm<z.infer<typeof doctorFormSchema>>({
    resolver: zodResolver(doctorFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      doctorTypeIds: [],
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
      // get doctor detail
      const { data } = await GetDoctor(params);

      // extract id from DoctorType
      form.reset({
        ...data,
        doctorTypeIds: data.DoctorType.map((item: any) => item.id.toString()),
        doctorFieldId: data.DoctorField.id.toString(),
        city: data.City?.id.toString(),
      });

      // get doctor fields
      const { data: doctorFields } = await getDoctorFields();
      //   convert id to string
      doctorFields.forEach((field: any) => {
        field.id = field.id.toString();
      });
      setDoctorFields(doctorFields);

      getNewTypes(data.doctorFieldId);

      // get cities
      const { data: cities } = await getCities();
      setCities(cities);
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (doctorTypes?.length > 0) {
      setIsLoading(false);
    }
  }, [doctorTypes]);

  async function onSubmit(values: z.infer<typeof doctorFormSchema>) {
    setIsUpdating(true);
    const intObj = {
      ...values,
      doctorTypeIds: values.doctorTypeIds.map((num) => parseInt(num, 10)),
    };

    const data = await UpdateDoctor({ data: intObj });

    if (data.status === 200) {
      toast.success("Doctor updated successfully");
      router.push("/admin/doctors");
    } else if (data.status === 409) {
      toast.error("Phone or Email already exists!", {
        description: (
          <div className="dark:text-white">
            Doctor already exists with <b>Phone Number</b> or <b>Email</b>.
          </div>
        ),
      });
      setIsUpdating(false);
    } else {
      setIsUpdating(false);
      toast.error("Failed to update doctor");
    }
  }

  async function getNewTypes(doctorFieldId: string) {
    const { data } = await getDoctorTypeList(doctorFieldId);

    data?.forEach((type: any) => {
      type.id = type.id.toString();
    });

    setDoctorTypes(data);
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
      await updateDoctorImage({
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
    const res = await updateDoctorPassword(values);

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
    <div className="flex items-center justify-center container h-full">
      <Loader className="w-5 h-5 animate-spin" />
    </div>
  ) : (
    <>
      <div className="space-y-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/doctors">Doctors</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Edit Doctor</BreadcrumbPage>
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
                <CardTitle>Edit Doctor Details</CardTitle>
                <CardDescription>Update profile information.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid lg:grid-cols-2 lg:gap-4 gap-2">
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
                    disabled={isUpdating}
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <Select
                          disabled={isUpdating}
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
                    disabled={isUpdating}
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <Select
                          disabled={isUpdating}
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
                              <SelectItem
                                key={city.id}
                                value={city.id.toString()}>
                                {city.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          You can manage Fields in{" "}
                          <Link href="/examples/forms" className="underline">
                            Fields Page
                          </Link>
                          .
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
                <div>
                  <FormField
                    disabled={isUpdating}
                    control={form.control}
                    name="doctorFieldId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Field</FormLabel>
                        <Select
                          disabled={isUpdating}
                          defaultValue={form.getValues("doctorFieldId")}
                          onValueChange={(value) => {
                            field.onChange(value);
                            getNewTypes(value);
                            form.setValue("doctorTypeIds", []);
                          }}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={"Select Field"} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {doctorFields?.map((doctorField: any) => (
                              <SelectItem
                                key={doctorField.id}
                                value={doctorField.id.toString()}>
                                {doctorField.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          You can manage Fields in{" "}
                          <Link href="/examples/forms" className="underline">
                            Fields Page
                          </Link>
                          .
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <FormField
                    disabled={isUpdating}
                    control={form.control}
                    name="doctorTypeIds"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel>Types</FormLabel>
                          <FormDescription>
                            {doctorTypes?.length > 0 ? (
                              <>
                                You can manage Types in{" "}
                                <Link href="/types" className="underline">
                                  Types Page
                                </Link>
                              </>
                            ) : (
                              "Select a field first"
                            )}
                          </FormDescription>
                        </div>
                        {doctorTypes.map(
                          (item: {
                            id: string;
                            name: string;
                            doctorId: number;
                            Doctor: { id: number; name: string }[];
                          }) => (
                            <FormField
                              disabled={isUpdating}
                              key={item.id}
                              control={form.control}
                              name="doctorTypeIds"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={item.id}
                                    className="flex flex-row items-start space-x-3 space-y-0">
                                    <FormControl>
                                      <Checkbox
                                        disabled={isUpdating}
                                        checked={field.value.includes(item.id)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([
                                                ...field.value,
                                                item.id,
                                              ])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== item.id
                                                )
                                              );
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="text-sm font-normal gap-2 flex">
                                      {item.name}
                                      {item.Doctor?.length > 0 && (
                                        <span className="text-muted-foreground flex gap-2 items-center">
                                          <Icon icon={"lucide:move-right"} />(
                                          {item.Doctor.map(
                                            (doctor) => doctor.name
                                          ).join(", ")}
                                          )
                                        </span>
                                      )}
                                    </FormLabel>
                                  </FormItem>
                                );
                              }}
                            />
                          )
                        )}
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

      {/* Dialog for change doctor password 👇 */}
      <Dialog open={isPasswordFormOpen} onOpenChange={setIsPasswordFormOpen}>
        <DialogContent onPointerDownOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Change Doctor Password</DialogTitle>
            <DialogDescription>
              Are you sure you want to change password of this doctor?
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
                            placeholder="Confirm Password"
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

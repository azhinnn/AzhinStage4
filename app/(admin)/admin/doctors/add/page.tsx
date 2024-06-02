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
import { useEffect, useState } from "react";
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
import { AddDoctor } from "@/helper/doctorActions";
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
import { Icon } from "@iconify/react/dist/iconify.js";
import { Loader } from "lucide-react";
import { getCities } from "@/helper/cityActions";

const doctorFormSchema = z.object({
  name: z.string().min(2).max(50),
  phone: z
    .string()
    .min(11)
    .max(11)
    .refine((value) => /^(075|077|078)\d{8}$/.test(value), {
      message: "Phone number must start with 075, 077, or 078.",
    }),
  email: z.string().email().min(2).max(50),
  city: z.string().nullable(),
  street: z.string().nullable(),
  gender: z.string({
    required_error: "Please select a Gender.",
  }),
  image: z.string().optional().nullable(),
  doctorFieldId: z.string({ required_error: "doctor field is required" }),
  doctorTypeIds: z
    .array(z.string())
    .refine((value) => value.some((item) => item), {
      message: "You have to select at least one item.",
    }),
});

export default function Page() {
  const router = useRouter();
  const [cities, setCities] = useState([]);
  const [doctorFields, setDoctorFields] = useState([]);
  const [doctorTypes, setDoctorTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof doctorFormSchema>>({
    resolver: zodResolver(doctorFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      image: "",
      city: "",
      street: "",
      doctorTypeIds: [],
      doctorFieldId: "",
    },
  });

  useEffect(() => {
    async function fetchData() {
      // get doctor fields
      const { data: doctorFields } = await getDoctorFields();
      //   convert id to string
      doctorFields.forEach((field: any) => {
        field.id = field.id.toString();
      });

      setDoctorFields(doctorFields);

      // get cities
      const { data: cities } = await getCities();
      setCities(cities);
    }
    fetchData();
  }, []);

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

  async function onSubmit(values: z.infer<typeof doctorFormSchema>) {
    setIsLoading(true);
    const imgRes = await handleImageUpload();

    const intObj = {
      ...values,
      doctorTypeIds: values.doctorTypeIds.map((num) => parseInt(num, 10)),
      doctorFieldId: parseInt(values.doctorFieldId, 10),
    };

    const data = await AddDoctor({ data: { ...intObj, image: imgRes?.url } });
    if (data.status === 200) {
      toast.success("Doctor added successfully");
      router.push("/admin/doctors");
    } else if (data.status === 409) {
      toast.error("Doctor already exists!", {
        description: (
          <div className="dark:text-white">
            Doctor already exists with <b>Phone Number</b> or <b>Email</b>.
          </div>
        ),
      });
      setIsLoading(false);
    } else {
      setIsLoading(false);
      toast.error("Something went wrong");
    }
    router.refresh();
  }

  async function getNewTypes(doctorFieldId: string) {
    const { data } = await getDoctorTypeList(doctorFieldId);

    data?.forEach((type: any) => {
      type.id = type.id.toString();
    });

    setDoctorTypes(data);
  }

  return (
    <div className="space-y-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/doctors">Doctors</BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Add Doctor</BreadcrumbPage>
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

              <div className="grid lg:grid-cols-2 lg:gap-4 gap-2">
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
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
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
                            <SelectItem
                              key={city.id}
                              value={city.id.toString()}>
                              {city.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        You can manage Cities in{" "}
                        <Link href="/admin/settings" className="underline">
                          Settings
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
              <div>
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="doctorFieldId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Field</FormLabel>
                      <Select
                        disabled={isLoading}
                        onValueChange={(value) => {
                          field.onChange(value);
                          getNewTypes(value);
                          form.setValue("doctorTypeIds", []);
                        }}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a field" />
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
                  disabled={isLoading}
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
                            disabled={isLoading}
                            key={item.id}
                            control={form.control}
                            name="doctorTypeIds"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={item.id}
                                  className="flex flex-row items-center space-x-3 space-y-0 hover:cursor-pointer hover:bg-muted py-1 px-2 rounded-md transition-colors">
                                  <FormControl>
                                    <Checkbox
                                      disabled={isLoading}
                                      checked={field.value?.includes(item.id)}
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
                                    <b>{item.name}</b>
                                    {item.Doctor?.length > 0 && (
                                      <span className="text-muted-foreground flex gap-2 items-center">
                                        {" "}
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
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Add Doctor"
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}

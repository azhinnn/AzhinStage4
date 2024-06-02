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
import { Loader } from "lucide-react";
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
import { getDoctorType, updateDoctorType } from "@/helper/doctorTypeActions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getDoctorFields } from "@/helper/doctorFieldActions";
import Link from "next/link";
import { Textarea } from "@/components/ui/textarea";

const typeFormSchema = z.object({
  id: z.number(),
  name: z.string().min(2).max(50),
  price: z.string().min(0),
  doctorFieldId: z.string({ required_error: "doctor field is required" }),
});

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ChildComponent />
    </Suspense>
  );
}

function ChildComponent() {
  const params = useSearchParams().get("id");
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [doctorFields, setDoctorFields] = useState<any[]>([]);

  const form = useForm<z.infer<typeof typeFormSchema>>({
    resolver: zodResolver(typeFormSchema),
  });

  useEffect(() => {
    async function fetchData() {
      const { data } = await getDoctorType(params);

      form.reset({
        ...data,
        doctorFieldId: data?.doctorFieldId?.toString(),
        price: data?.price?.toString(),
      });

      const { data: doctorFields } = await getDoctorFields();

      setDoctorFields(doctorFields);
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (doctorFields?.length > 0) {
      setIsLoading(false);
    }
  }, [doctorFields]);

  async function onSubmit(values: z.infer<typeof typeFormSchema>) {
    setIsUpdating(true);
    const res = await updateDoctorType(values);

    if (res.status === 409) {
      toast.error("Name already exists!", {
        description: (
          <div className="dark:text-white">Please choose a different name</div>
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
    toast.success("Type updated successfully");
    router.push("/admin/types");
  }

  return isLoading ? (
    <div className="flex items-center justify-center container h-full">
      <Loader className="w-5 h-5 animate-spin" />
    </div>
  ) : (
    <div className="space-y-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/types">Types</BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Update Type</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Card>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <CardHeader>
              <CardTitle>Update Type </CardTitle>
              <CardDescription>Update Type information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <FormField
                  disabled={isUpdating}
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
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
                  control={form.control}
                  name="doctorFieldId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Field</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}>
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
                        <Link href="/admin/fields" className="underline">
                          Fields Page
                        </Link>
                        .
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-2">
                <FormField
                  disabled={isUpdating}
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter price"
                          {...field}
                          type="number"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isUpdating} className="w-full">
                {isUpdating ? (
                  <Loader className="w-5 h-5 animate-spin" />
                ) : (
                  "Update Type"
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}

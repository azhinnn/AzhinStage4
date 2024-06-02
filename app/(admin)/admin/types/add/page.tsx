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
import { useEffect, useState } from "react";
import { Loader } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { addDoctorType } from "@/helper/doctorTypeActions";
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
  name: z.string().min(2).max(50),
  price: z.string().min(0),
  doctorFieldId: z.string({ required_error: "doctor field is required" }),
});

export default function Page() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [doctorFields, setDoctorFields] = useState<any[]>([]);

  const form = useForm<z.infer<typeof typeFormSchema>>({
    resolver: zodResolver(typeFormSchema),
    defaultValues: {
      name: "",
      price: "",
      doctorFieldId: "",
    },
  });

  useEffect(() => {
    async function fetchData() {
      const { data: doctorFields } = await getDoctorFields();

      setDoctorFields(doctorFields);
    }

    fetchData();
  }, []);

  async function onSubmit(values: z.infer<typeof typeFormSchema>) {
    setIsLoading(true);

    const res = await addDoctorType(values);

    if (res.status === 409) {
      toast.error("Name already exists!", {
        description: (
          <div className="dark:text-white">Please choose a different name</div>
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
    toast.success("Type added successfully");
    router.push("/admin/types");
  }

  return (
    <div className="space-y-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/types">Types</BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Add Type</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Card>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <CardHeader>
              <CardTitle>Add Type </CardTitle>
              <CardDescription>Add Type information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <FormField
                  disabled={isLoading}
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
                  disabled={isLoading}
                  control={form.control}
                  name="doctorFieldId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Field</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        disabled={isLoading}>
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
                  disabled={isLoading}
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
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <Loader className="w-5 h-5 animate-spin" />
                ) : (
                  "Add Type"
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}

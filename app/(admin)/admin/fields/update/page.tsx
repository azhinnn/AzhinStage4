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
import { getDoctorField, updateDoctorField } from "@/helper/doctorFieldActions";

const fieldFormSchema = z.object({
  id: z.number(),
  name: z.string().min(2).max(50),
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
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof fieldFormSchema>>({
    resolver: zodResolver(fieldFormSchema),
    defaultValues: {
      id: Number(params),
      name: "",
    },
  });

  useEffect(() => {
    async function fetchDate() {
      const { data } = await getDoctorField(Number(params));
      form.reset({
        ...data,
      });
    }
    fetchDate();
  }, []);

  async function onSubmit(values: z.infer<typeof fieldFormSchema>) {
    setIsLoading(true);

    const res = await updateDoctorField(values);

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
    toast.success("Field updated successfully");
    router.push("/admin/fields");
  }

  return (
    <div className="space-y-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/fields">Fields</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Update Field</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Card>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <CardHeader>
              <CardTitle> Update Field </CardTitle>
              <CardDescription>Update Field information.</CardDescription>
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
                      <FormDescription>
                        Enter the name of the field.
                      </FormDescription>
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
                  "Update Field"
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}

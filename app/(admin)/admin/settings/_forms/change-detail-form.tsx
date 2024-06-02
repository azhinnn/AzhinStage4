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
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { updateCompany } from "@/helper/companyActions";

const FormSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  description: z.string().nullable().optional(),
});

export default function ChangeCompanyDetailForm({ data }: any) {
  const router = useRouter();

  const [isDetailUpadting, setIsDetailUpadting] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      id: data?.id,
      name: data?.name || "No Name",
      description: data?.description,
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsDetailUpadting(true);

    const res = await updateCompany(data);
    if (res.status !== 200) {
      toast.error("Something went wrong");
      return;
    }
    toast.success("Company updated successfully");
    router.refresh();
    setIsDetailUpadting(false);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Company Information</CardTitle>
        <CardDescription>Update your Company information.</CardDescription>
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
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter company name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              disabled={isDetailUpadting}
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Description</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter company description"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              onClick={() => {}}
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

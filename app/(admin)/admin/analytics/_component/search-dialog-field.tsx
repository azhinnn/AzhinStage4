"use client";

import { Button } from "@/components/ui/button";
import {
  DialogTrigger,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogContent,
  Dialog,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { FolderPlusIcon, LineChartIcon } from "lucide-react";
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
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { getDoctorFieldList } from "@/helper/doctorFieldActions";

const FormSchema = z.object({
  search: z.string().min(2).max(50),
});

export default function SearchDialogField() {
  const [fields, setFields] = useState<any>([]);
  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      search: "",
    },
  });

  async function onSubmit(values: z.infer<typeof FormSchema>) {
    const data = await getDoctorFieldList(values.search);

    if (data.length > 0) {
      setFields(data);
    } else if (data.length === 0) {
      setFields([]);
      toast.warning("No field found");
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="h-20 text-lg font-bold">
          <FolderPlusIcon className="w-5 h-5 mr-2" />
          Fields
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Search for Field</DialogTitle>
          <DialogDescription>
            Search for fields by <b>Name</b> to check their <b>Analytics</b>.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6">
                <FormField
                  control={form.control}
                  name="search"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Search Field</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-2">
                          <Input placeholder="Search" {...field} />
                          <Button type="submit">Search</Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </div>
          <div className="space-y-2">
            <div className="flex flex-col gap-2">
              {fields.map((field: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between border px-4 py-2 rounded">
                  <div className="flex items-center gap-2">
                    <FolderPlusIcon className="h-4 w-4" />{" "}
                    <p className="font-medium">{field?.name}</p>
                  </div>
                  <Button
                    size="icon"
                    onClick={() =>
                      router.push(`/admin/analytics/field?id=${field?.id}`)
                    }>
                    <LineChartIcon className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" className="w-full" asChild>
            <DialogClose onClick={() => form.reset()}>Close</DialogClose>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

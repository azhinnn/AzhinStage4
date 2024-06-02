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
import { FolderPlusIcon, LineChartIcon, MicroscopeIcon } from "lucide-react";
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
import { getDoctorTypeListByName } from "@/helper/doctorTypeActions";

const FormSchema = z.object({
  search: z.string().min(2).max(50),
});

export default function SearchDialogType() {
  const [types, setTypes] = useState<any>([]);
  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      search: "",
    },
  });

  async function onSubmit(values: z.infer<typeof FormSchema>) {
    const data = await getDoctorTypeListByName(values.search);
    console.log(data);

    if (data.length > 0) {
      setTypes(data);
    } else if (data.length === 0) {
      setTypes([]);
      toast.warning("No type found");
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="h-20 text-lg font-bold">
          <MicroscopeIcon className="w-5 h-5 mr-2" />
          Types
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Search for Type</DialogTitle>
          <DialogDescription>
            Search for types by <b>Name</b> to check it&apos;s <b>Analytics</b>.
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
                      <FormLabel>Search Type</FormLabel>
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
              {types.map((type: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between border px-4 py-2 rounded">
                  <div>
                    <div className="flex items-center gap-2">
                      <MicroscopeIcon className="h-4 w-4 mb-1" />{" "}
                      <p className="font-medium">{type?.name}</p>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <FolderPlusIcon className="h-3.5 w-3.5 mb-1" />{" "}
                      <p className="font-medium text-sm">
                        {type?.DoctorField.name}
                      </p>
                    </div>
                  </div>
                  <Button
                    size="icon"
                    onClick={() =>
                      router.push(`/admin/analytics/type?id=${type?.id}`)
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

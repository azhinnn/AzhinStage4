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
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar";
import {
  FolderPlusIcon,
  LineChartIcon,
  MailIcon,
  MicroscopeIcon,
  StethoscopeIcon,
} from "lucide-react";
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
import { GetDoctorList } from "@/helper/doctorActions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const FormSchema = z.object({
  search: z.string().min(2).max(50),
});

export default function SearchDialogDoctor() {
  const [doctors, setDoctors] = useState([]);
  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      search: "",
    },
  });

  async function onSubmit(values: z.infer<typeof FormSchema>) {
    const res = await GetDoctorList(values);

    if (res.status === 200 && res.data.length > 0) {
      setDoctors(res.data);
    } else if (res.status === 200 && res.data.length === 0) {
      setDoctors([]);
      toast.warning("No doctor found");
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="h-20 text-lg font-bold">
          <StethoscopeIcon className="w-5 h-5 mr-2" />
          Doctors
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Search for Doctor</DialogTitle>
          <DialogDescription>
            Search for doctors by <b>Name</b>, <b>Email</b> or <b>Phone</b> to
            check their <b>Analytics</b>.
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
                      <FormLabel>Search Doctor</FormLabel>
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
              {doctors.map((doctor: any, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between border px-4 py-2 rounded">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-14 h-14">
                      <AvatarImage
                        alt={doctor?.name}
                        src={doctor?.image || ""}
                      />
                      <AvatarFallback>{doctor?.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-bold text-lg">{doctor?.name}</p>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MailIcon className="h-3 w-3" />
                        <p className="text-sm">{doctor?.email}</p>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <FolderPlusIcon className="h-3 w-3" />
                        <p className="text-sm">{doctor?.DoctorField.name}</p>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MicroscopeIcon className="h-3 w-3" />
                        <p className="text-sm">
                          {doctor?.DoctorType.map((type: any) => (
                            <p key={type.id}>{type.name}</p>
                          ))}
                        </p>
                      </div>
                    </div>
                  </div>
                  <Button
                    size="icon"
                    onClick={() =>
                      router.push(`/admin/analytics/doctor?id=${doctor?.id}`)
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

"use client";

import { Row } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { deleteCity, updateCity } from "@/helper/cityActions";
import { Loader, Pen, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { citySchema } from "./schema";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

const FormSchema = z.object({
  id: z.number(),
  name: z.string().min(2, {
    message: "name must be at least 2 characters.",
  }),
});

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const city = citySchema.parse(row.original);
  const router = useRouter();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      id: city.id,
      name: city.name || "",
    },
  });

  // Update city 👇
  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsDeleting(true);
    const res = await updateCity(data);

    if (res.status === 409) {
      toast.warning("City already exists", {
        description: (
          <div className="text-white">
            City <b>{data.name}</b> already exists, please choose another name.
          </div>
        ),
      });
    } else if (res.status !== 200) {
      toast.error("Something went wrong");
    } else if (res.status === 200) {
      toast.success("City updated successfully");
      setIsDialogOpen(false);
      router.refresh();
    }

    setIsDeleting(false);
  }

  // Delete city 👇
  async function onDelete(id: number) {
    const res = await deleteCity({ id });

    if (res.status === 409) {
      toast.warning("City is in use", {
        description: (
          <div className="dark:text-white">
            Please delete or change <b>Patient</b> City first to delete City
          </div>
        ),
      });
    } else if (res.status === 200) {
      toast.success("City deleted successfully");
    } else {
      toast.error("Something went wrong");
    }
    router.refresh();
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
            <DotsHorizontalIcon className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem onClick={() => setIsDialogOpen(true)}>
            Edit
            <DropdownMenuShortcut className="opacity-100">
              <Pen className="w-4 h-4" />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onDelete(city.id)}>
            Delete
            <DropdownMenuShortcut className="opacity-100">
              <Trash2 className="w-4 h-4 text-red-500" />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Add City</AlertDialogTitle>
            <AlertDialogDescription>
              Add a new city to the list.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="City Name"
                        {...field}
                        disabled={isDeleting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <Button type="submit" disabled={isDeleting}>
                  {isDeleting ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    "Add City"
                  )}
                </Button>
              </AlertDialogFooter>
            </form>
          </Form>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

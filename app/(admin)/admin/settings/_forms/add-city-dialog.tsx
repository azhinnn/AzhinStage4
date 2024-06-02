"use client";
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
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { addCity } from "@/helper/cityActions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const FormSchema = z.object({
  name: z.string().min(2, {
    message: "name must be at least 2 characters.",
  }),
});

export default function AddCityDialog() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsAdding(true);
    const res = await addCity(data);
    if (res.status === 409) {
      toast.warning("City already exists");
    } else if (res.status !== 200) {
      toast.error("Something went wrong");
    } else if (res.status === 200) {
      toast.success("City added successfully");
      setIsDialogOpen(false);
      router.refresh();
      form.reset();
    }

    setIsAdding(false);
  }

  return (
    <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <Button
        asChild
        size={"sm"}
        className="rounded-full aspect-square p-2 w-10 h-10 hover:rotate-90 transition-transform">
        <AlertDialogTrigger>
          <Plus />
        </AlertDialogTrigger>
      </Button>
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
                      disabled={isAdding}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <Button type="submit" disabled={isAdding}>
                {isAdding ? (
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
  );
}

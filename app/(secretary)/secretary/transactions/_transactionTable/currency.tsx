"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ArrowDownCircle, Loader } from "lucide-react";
import { useState } from "react";
import { getCurrency, setCurrency } from "@/helper/currencyActions";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Label } from "@/components/ui/label";

const FormSchema = z.object({
  price: z
    .string({
      required_error: "Price is required",
    })
    .min(1, { message: "Price is required" }),
});

export default function Currency({
  className,
  currency,
}: {
  className?: string;
  currency: number;
}) {
  const [currentPrice, setCurrentPrice] = useState(currency || 0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      price: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const res = await setCurrency(data);
    if (res.status === 200) {
      setCurrentPrice(res.data?.price || 0);
      toast.success("Currency price updated successfully");
    } else {
      toast.error("Something went wrong");
    }
    setIsDialogOpen(false);
  }
  return (
    <>
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild className={className}>
              <Button
                variant={"outline"}
                className="border-primary text-primary hover:text-primary/70"
                asChild>
                <AlertDialogTrigger>
                  {currentPrice ? (
                    "$1 USD = " + (currentPrice.toLocaleString() || 0) + " IQD"
                  ) : (
                    <Loader className="w-5 h-5 animate-spin" />
                  )}
                </AlertDialogTrigger>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <Label>Change Currency Price</Label>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <AlertDialogContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <AlertDialogHeader>
                <AlertDialogTitle>Currency Price</AlertDialogTitle>
                <AlertDialogDescription>
                  You can change the currency price here!
                </AlertDialogDescription>
              </AlertDialogHeader>

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      New Price ($1 USD ={" "}
                      <ArrowDownCircle className="w-4 h-4 text-primary" /> IQD)
                    </FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="$1 in IQD" {...field} />
                    </FormControl>
                    <FormDescription>
                      This will be the price of IQD for $1 USD.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <Button type="submit">Submit</Button>
              </AlertDialogFooter>
            </form>
          </Form>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

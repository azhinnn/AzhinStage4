"use client";

import { Row } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  AlarmClock,
  Circle,
  DollarSign,
  DownloadIcon,
  ImageIcon,
  Info,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { visitSchema } from "./schema";
import { updateVisitStatus, updateVisitTime } from "@/helper/visitActoins";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { utc } from "moment";
import Link from "next/link";
import { visitStatus } from "@/components/myTableComponent/data";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Image from "next/image";
interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

const changeTimeSchema = z.object({
  id: z.number(),
  time: z.string(),
  currentTime: z.string(),
});

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const visit = visitSchema.parse(row.original);

  async function downloadVisitImage() {
    if (visit?.image) {
      const response = await fetch(visit.image);
      const blob = await response.blob();

      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `visit_image_${visit.id}.jpg`;
      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  }

  const router = useRouter();
  const [isNextVisitOpen, setIsNextVisitOpen] = useState(false);
  const [isChangeTimeOpen, setIsChangeTimeOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<string | null>(null);

  const serviceCoast = visit.Appointment.DoctorType.price;
  const discountPercentage = visit.Appointment.Discount?.percentage ?? 0;
  const afterDiscount =
    serviceCoast - (serviceCoast * discountPercentage) / 100;
  const totalPaid = visit.Appointment.Transaction?.map(
    (tran: any) => tran.amount
  ).reduce((a: any, b: any) => a + b, 0);
  const remaining = afterDiscount - totalPaid;

  const time = utc(new Date(visit?.date)).format("HH:mm");

  const changeTimeForm = useForm<z.infer<typeof changeTimeSchema>>({
    resolver: zodResolver(changeTimeSchema),
    defaultValues: {
      id: visit.id,
      time: time,
      currentTime: visit?.date,
    },
  });

  // change status of visit 👇
  async function onStatusChange({
    id,
    status,
  }: {
    id: number;
    status: string;
  }) {
    if (status === "completed" && totalPaid.toFixed(2) === "0.00") {
      toast.warning("Patient has to pay atleast a minimum amount", {
        duration: 6000,
      });
    } else {
      // update visit status
      const res = await updateVisitStatus({ data: { id, status } });
      if (res.status === 400) {
        toast.warning("Patient not completed the payment", {
          description: (
            <div className="text-white">
              Patient has to pay <b>Service Cost</b> to change status to{" "}
              <b>Cancelled</b>!
            </div>
          ),
          duration: 6000,
        });
        return;
      } else if (res.status !== 200) {
        toast.error("Something went wrong");
        return;
      }
      toast.success("Status updated successfully");
    }

    if ((status === "completed" || status === "arrived") && remaining > 0) {
      setNewStatus(status);
      setIsPaymentOpen(true);
    } else if (status === "cancelled" || status === "notArived") {
      setIsNextVisitOpen(true);
    } else {
      router.refresh();
    }
  }

  // change time of visit 👇
  async function onChangeTimeSubmit(data: z.infer<typeof changeTimeSchema>) {
    const [newHour, newMin] = data.time.split(":");
    const newTime = utc(new Date(data.currentTime))
      .hour(Number(newHour))
      .minute(Number(newMin));

    const res = await updateVisitTime({ data: { id: data.id, newTime } });

    if (res.status !== 200) {
      toast.error("Something went wrong");
    }
    setIsChangeTimeOpen(false);
    toast.success("Time updated successfully");
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
          <DropdownMenuItem onClick={() => setIsChangeTimeOpen(true)}>
            <AlarmClock className="mr-2 h-4 w-4" />
            Edit Time
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              router.push(
                `/secretary/transactions/add?appid=${visit.Appointment.id}`
              )
            }>
            <DollarSign className="mr-2 h-4 w-4" />
            Add Payment
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              router.push(
                `/secretary/appointments/detail?id=${visit.Appointment.id}`
              )
            }>
            <Info className="mr-2 h-4 w-4" />
            Details
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={!visit?.image}
            onClick={() => setIsImageOpen(true)}>
            <ImageIcon className="mr-2 h-4 w-4" />
            Image
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Circle className="mr-2 h-4 w-4" /> Status
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup value={visit.status}>
                {visitStatus.map((status) => (
                  <DropdownMenuRadioItem
                    disabled={status.value === "checkedIn"}
                    onClick={() => {
                      onStatusChange({
                        id: Number(visit.id),
                        status: status.value,
                      });
                    }}
                    key={status.value}
                    value={status.value}
                    className="gap-2 cursor-pointer">
                    <status.icon className="w-4 h-4" />
                    <span> {status.label}</span>
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
      {/* Dialog for add next visit after changing visit status 👇 */}
      <AlertDialog open={isNextVisitOpen} onOpenChange={setIsNextVisitOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Add Next Visit?</AlertDialogTitle>
            <AlertDialogDescription>
              You can add next visit for this Patient now or later.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel
              onClick={() => {
                router.refresh();
              }}>
              Cancel
            </AlertDialogCancel>
            <Button asChild className="w-20">
              <Link href={`/secretary/visits/add?id=${visit.Appointment.id}`}>
                Add
              </Link>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog for changing visit time 👇*/}
      <AlertDialog open={isChangeTimeOpen} onOpenChange={setIsChangeTimeOpen}>
        <AlertDialogContent>
          <Form {...changeTimeForm}>
            <form
              onSubmit={changeTimeForm.handleSubmit(onChangeTimeSubmit)}
              className="space-y-6">
              <AlertDialogHeader>
                <AlertDialogTitle>Edit Visit Time</AlertDialogTitle>
                <AlertDialogDescription>
                  Make changes to visit time.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="grid gap-4 py-4">
                <FormField
                  control={changeTimeForm.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Visit Time</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Visit Time"
                          type="time"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        This will be the time of visit.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <AlertDialogFooter className="gap-2">
                <AlertDialogCancel
                  onClick={() => {
                    changeTimeForm.setValue("time", time);
                  }}>
                  Cancel
                </AlertDialogCancel>
                <Button type="submit">Change Time</Button>
              </AlertDialogFooter>
            </form>
          </Form>
        </AlertDialogContent>
      </AlertDialog>
      {/* Dialog for payment 👇 */}
      <AlertDialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Add Payment</AlertDialogTitle>
            <AlertDialogDescription>
              Patient can pay in <b>Cash</b> or put it in <b>Debt</b>.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel
              onClick={() => {
                router.refresh();
              }}>
              Cancel
            </AlertDialogCancel>
            <Button asChild className="w-20">
              <Link
                href={`/secretary/transactions/add?appid=${visit.Appointment.id}&vid=${visit.id}&status=${newStatus}`}>
                Add
              </Link>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {/* image dialog 👇*/}
      <AlertDialog open={isImageOpen} onOpenChange={setIsImageOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center">
              Image Preview
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              Image Preview of Visit <b>{visit.id}</b>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div>
            <div className="w-full flex flex-col items-center justify-center">
              {visit.image ? (
                <Image
                  src={visit?.image || ""}
                  alt="Visit Image"
                  width={300}
                  height={300}
                  className="object-contain rounded max-w-[300px] max-h-[300px]"
                />
              ) : (
                <div className="border rounded w-[200px] h-[200px] flex items-center justify-center text-muted-foreground">
                  No Image
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Button
              size={"icon"}
              onClick={() => {
                downloadVisitImage();
              }}>
              <DownloadIcon className="w-4 h-4" />
            </Button>
            <AlertDialogCancel>Close</AlertDialogCancel>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

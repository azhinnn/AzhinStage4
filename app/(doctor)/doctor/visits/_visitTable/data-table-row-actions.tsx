"use client";

import { Row } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  Circle,
  ClipboardPen,
  DownloadIcon,
  ImageIcon,
  ImagePlusIcon,
  ImageUpIcon,
  Info,
  LoaderIcon,
} from "lucide-react";
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
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import {
  updateVisitImage,
  updateVisitNote,
  updateVisitStatus,
} from "@/helper/visitActoins";
import { toast } from "sonner";
import { visitStatus } from "@/components/myTableComponent/data";
import Image from "next/image";
import { useEdgeStore } from "@/lib/edgestore";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

const FormSchema = z.object({
  id: z.number(),
  note: z
    .string()
    .min(2, { message: "Note must be at least 2 characters." })
    .optional(),
});

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const visit = visitSchema.parse(row.original);
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isImageOpen, setIsImageOpen] = useState(false);

  const [file, setFile] = useState<File | undefined>();
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { edgestore } = useEdgeStore();

  //  change or add image to visit
  async function handleImageUpload() {
    if (file) {
      setIsUploading(true);
      const res = await edgestore.publicFiles.upload({
        file,
        options: visit?.image ? { replaceTargetUrl: visit?.image } : {},
        onProgressChange: (progress) => {
          setProgress(progress);
        },
      });

      const resImg = await updateVisitImage(visit.id, res.url);

      if (resImg.success) {
        toast.success("Image Updated successfully");
      } else {
        toast.error("Something went wrong");
      }

      setProgress(0);
      setIsUploading(false);
      setFile(undefined);
      router.refresh();
    }
  }
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

  const serviceCoast = visit.Appointment.DoctorType.price;
  const discountPercentage = visit.Appointment.Discount?.percentage ?? 0;
  const afterDiscount =
    serviceCoast - (serviceCoast * discountPercentage) / 100;
  const totalPaid = visit.Appointment.Transaction?.map(
    (tran: any) => tran.amount
  ).reduce((a: any, b: any) => a + b, 0);
  const remaining = afterDiscount - totalPaid;

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      id: visit.id,
      note: visit.note || "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true);

    const res = await updateVisitNote({ data });
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
    toast.success("Note updated successfully");
    setIsLoading(false);
    setIsOpen(false);
    form.reset();
    router.refresh();
  }

  // change status of visit 👇
  async function onStatusChange({
    id,
    status,
  }: {
    id: number;
    status: string;
  }) {
    // check if the visit is completed and if the total paid is less than 50% of service cost 👇
    if (status === "completed" && totalPaid / afterDiscount < 0.5) {
      toast.warning("Patient has to pay atleast 50%", {
        description: (
          <div className="dark:text-white">
            First pay atleast <b>50%</b> of <b>Service Cost</b> to change status
            to <b>Completed</b>!
          </div>
        ),
        duration: 6000,
      });
    } else {
      // update visit status
      const res = await updateVisitStatus({ data: { id, status } });
      if (res.status !== 200) {
        toast.error("Something went wrong");
        return;
      }
      toast.success("Status updated successfully");
      router.refresh();
    }
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
          <DropdownMenuItem
            onClick={() =>
              router.push(
                `/doctor/appointments/detail?id=${visit.Appointment.id}`
              )
            }>
            <Info className="mr-2 h-4 w-4" />
            Details
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsOpen(true)}>
            <ClipboardPen className="mr-2 h-4 w-4" />
            Edit Note
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsImageOpen(true)}>
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

      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Add Note</AlertDialogTitle>
            <AlertDialogDescription>
              You can <b>Add</b> or <b>Edit</b> a note to the visit.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                disabled={isLoading}
                control={form.control}
                name="note"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Note</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Note"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormDescription>
                      This is the note of the visit.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <AlertDialogFooter>
                <AlertDialogCancel disabled={isLoading}>
                  Cancel
                </AlertDialogCancel>
                <Button type="submit" disabled={isLoading}>
                  Continue
                </Button>
              </AlertDialogFooter>
            </form>
          </Form>
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
          <div className="space-y-8">
            <div className="w-full flex flex-col items-center justify-center gap-2">
              {visit.image || file ? (
                <>
                  <Image
                    src={file ? URL.createObjectURL(file) : visit?.image || ""}
                    alt="Visit Image"
                    width={300}
                    height={300}
                    className="object-contain rounded max-w-[300px] max-h-[300px]"
                  />
                  {file && (
                    <div className="flex items-center gap-2 mb-8">
                      <Button
                        disabled={isUploading}
                        className="w-full"
                        onClick={handleImageUpload}>
                        {isUploading ? (
                          <LoaderIcon className="animate-spin w-4 h-4" />
                        ) : (
                          <ImageUpIcon className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        disabled={isUploading}
                        className="w-full"
                        onClick={() => setFile(undefined)}
                        variant={"outline"}>
                        Cancel
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="border rounded w-[200px] h-[200px] flex items-center justify-center text-muted-foreground flex-col gap-3">
                  No Image
                  <Button asChild className="px-8" disabled={isUploading}>
                    <Label className="cursor-pointer">
                      <ImageUpIcon className="w-4 h-4" />
                      <Input
                        type="file"
                        onChange={(e) => setFile(e.target.files?.[0])}
                        className="hidden"
                      />
                    </Label>
                  </Button>
                </div>
              )}
            </div>
          </div>
          {isUploading && <Progress value={progress} className="w-full" />}
          <div className="flex items-center justify-center gap-2">
            {visit.image && !file && (
              <>
                <Button
                  size={"icon"}
                  onClick={() => {
                    downloadVisitImage();
                  }}>
                  <DownloadIcon className="w-4 h-4" />
                </Button>
                <Button asChild size={"icon"} disabled={isUploading}>
                  <Label className="cursor-pointer">
                    <ImageUpIcon className="w-4 h-4" />
                    <Input
                      type="file"
                      onChange={(e) => setFile(e.target.files?.[0])}
                      className="hidden"
                    />
                  </Label>
                </Button>
              </>
            )}
            <AlertDialogCancel>Close</AlertDialogCancel>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

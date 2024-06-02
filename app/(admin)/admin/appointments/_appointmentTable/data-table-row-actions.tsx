"use client";
import { Row } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { DollarSign, Info, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { deleteAppointment } from "@/helper/appointmentActions";
import { appointmentSchema } from "./schema";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const appointment = appointmentSchema.parse(row.original);
  const router = useRouter();

  // to delte appointment 👇
  async function onDelete(id: number) {
    const res = await deleteAppointment(id);

    if (res.status !== 200) {
      toast.error("Something went wrong");
      return;
    }

    toast.success("Appointment deleted successfully");
    router.refresh();
  }

  return (
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
          onClick={() => {
            router.push(`/admin/appointments/detail?id=${appointment.id}`);
          }}>
          Details
          <DropdownMenuShortcut className="opacity-100">
            <Info className="w-4 h-4" />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            router.push(`/admin/transactions/add?appid=${appointment.id}`)
          }>
          Add Payment
          <DropdownMenuShortcut className="opacity-100">
            <DollarSign className="w-4 h-4" />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onDelete(appointment.id)}>
          Delete
          <DropdownMenuShortcut className="opacity-100">
            <Trash2 className="w-4 h-4 text-red-500" />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

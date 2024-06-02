"use client";

import { Row } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Pen, ScrollText, Trash2 } from "lucide-react";
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
import { patientSchema } from "./schema";
import { deletePatient } from "@/helper/patientActions";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const patient = patientSchema.parse(row.original);
  const router = useRouter();

  async function onDelete(id: number) {
    const res = await deletePatient(id);
    if (res.status === 409) {
      toast.error("Patient has Appointments", {
        description: (
          <div className="dark:text-white">
            Please delete <b>Appointments</b> for this Patient first to delete
            Patient
          </div>
        ),
      });
      return;
    }

    if (res.status !== 200) {
      toast.error("Something went wrong");
      return;
    }
    toast.success("Patient deleted successfully");
    router.refresh();
  }

  function onUpdate(id: number) {
    router.push(`/secretary/patients/update?id=${id}`);
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
        <DropdownMenuItem onClick={() => onUpdate(patient.id)}>
          Edit
          <DropdownMenuShortcut className="opacity-100">
            <Pen className="w-4 h-4" />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            router.push(`/secretary/appointments?query=${patient.phone}`)
          }>
          Appointments
          <DropdownMenuShortcut className="opacity-100">
            <ScrollText className="w-4 h-4" />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onDelete(patient.id)}>
          Delete
          <DropdownMenuShortcut className="opacity-100">
            <Trash2 className="w-4 h-4 text-red-500" />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

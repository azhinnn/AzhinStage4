"use client";

import { Row } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { LineChartIcon, Pen, Trash2 } from "lucide-react";
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
import { doctorFieldSchema } from "./schema";
import { deleteDoctorField } from "@/helper/doctorFieldActions";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const field = doctorFieldSchema.parse(row.original);
  const router = useRouter();

  async function onDelete(id: number) {
    const res = await deleteDoctorField(id);

    if (res.status === 409) {
      toast.error("Field is in use", {
        description: (
          <div className="dark:text-white">
            Please remove the <b>Doctor</b>&apos;s or <b>Doctor Type</b>&apos;s
            related to this field
          </div>
        ),
      });
      return;
    }
    if (res.status !== 200) {
      toast.error("Something went wrong");
      return;
    }

    toast.success("Field deleted successfully");
    router.refresh();
  }

  function onUpdate(id: number) {
    router.push(`/admin/fields/update?id=${id}`);
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
        <DropdownMenuItem onClick={() => onUpdate(field.id)}>
          Edit
          <DropdownMenuShortcut className="opacity-100">
            <Pen className="w-4 h-4" />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push(`/admin/analytics/field?id=${field.id}`)}>
          Analytic
          <DropdownMenuShortcut className="opacity-100">
            <LineChartIcon className="w-4 h-4" />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onDelete(field.id)}>
          Delete
          <DropdownMenuShortcut className="opacity-100">
            <Trash2 className="w-4 h-4 text-red-500" />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

"use client";

import { Row } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { secretarySchema } from "./schema";
import { Pen, Trash2 } from "lucide-react";
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
import { deleteSecretary } from "@/helper/secretaryActions";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const secretary = secretarySchema.parse(row.original);
  const router = useRouter();

  async function onDelete(id: any) {
    const res = await deleteSecretary(id);

    if (res.status === 409) {
      toast.error("Secretary has Appointments!", {
        description: (
          <div className="dark:text-white">
            Secretary has <b>Appointments</b> and cannot be deleted.
          </div>
        ),
      });
    } else if (res.status === 200) {
      toast.success("secretary deleted successfully");
    } else {
      toast.error("Something went wrong");
    }

    router.refresh();
  }

  function onUpdate(id: number) {
    router.push(`/admin/secretaries/update?id=${id}`);
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
        <DropdownMenuItem onClick={() => onUpdate(secretary.id)}>
          Edit
          <DropdownMenuShortcut className="opacity-100">
            <Pen className="w-4 h-4" />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onDelete(secretary.id)}>
          Delete
          <DropdownMenuShortcut className="opacity-100">
            <Trash2 className="w-4 h-4 text-red-500" />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

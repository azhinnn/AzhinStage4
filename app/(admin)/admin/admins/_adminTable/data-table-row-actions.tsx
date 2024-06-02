"use client";

import { Row } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { adminSchema } from "./schema";
import { deleteAdmin, updateAdmin } from "@/helper/adminActions";
import { Pen, Trash2 } from "lucide-react";
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

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const admin = adminSchema.parse(row.original);
  const router = useRouter();

  // Delete admin 👇
  async function onDelete(id: number) {
    const res = await deleteAdmin(id);

    if (res.status === 200) {
      toast.success("Admin deleted successfully");
    } else {
      toast.error("Something went wrong");
    }

    router.refresh();
  }

  // update admin 👇
  function onUpdate(id: number) {
    router.push(`/admin/admins/update?id=${id}`);
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
        <DropdownMenuItem onClick={() => onUpdate(admin.id)}>
          Edit
          <DropdownMenuShortcut className="opacity-100">
            <Pen className="w-4 h-4" />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onDelete(admin.id)}>
          Delete
          <DropdownMenuShortcut className="opacity-100">
            <Trash2 className="w-4 h-4 text-red-500" />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

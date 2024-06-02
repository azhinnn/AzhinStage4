"use client";

import { Row } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { visitSchema } from "./schema";
import { visitStatus } from "@/components/myTableComponent/data";
import { updateVisitStatus } from "@/helper/visitActoins";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const visit = visitSchema.parse(row.original);
  const router = useRouter();

  async function onStatusChange({
    id,
    status,
  }: {
    id: number;
    status: string;
  }) {
    const res = await updateVisitStatus({ data: { id, status } });

    if (res.status !== 200) {
      toast.error("Something went wrong");
      return;
    }
    toast.success("Status updated successfully");
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
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Status</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup value={visit.status}>
              {visitStatus.map((status) => (
                <DropdownMenuRadioItem
                  onClick={() => {
                    onStatusChange({
                      id: Number(visit.id),
                      status: status.value,
                    });
                  }}
                  key={status.value}
                  value={status.value}
                  className="gap-2">
                  <status.icon className="w-4 h-4" />
                  <span> {status.label}</span>
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

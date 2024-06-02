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
import { waitingSchema } from "./schema";
import { waitingStatus } from "@/components/myTableComponent/data";
import { Circle } from "lucide-react";
import { updateWaitingStatus } from "@/helper/waitingActions";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const waiting = waitingSchema.parse(row.original);
  const router = useRouter();

  async function onStatusChange({
    id,
    status,
  }: {
    id: number;
    status: string;
  }) {
    const res = await updateWaitingStatus({ id, status });

    if (res.status === 200) {
      toast.success("Status updated successfully");
      if (status === "accepted") {
        router.push(`/secretary/visits/add?id=${res.data?.id}`);
      } else {
        router.refresh();
      }
    } else {
      toast.error("Something went wrong");
    }
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
          <DropdownMenuSubTrigger>
            <Circle className="mr-2 h-4 w-4" />
            Status
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup value={waiting.status}>
              {waitingStatus.map((status) => (
                <DropdownMenuRadioItem
                  onClick={() => {
                    onStatusChange({
                      id: Number(waiting.id),
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

"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/myTableComponent/data-table-column-header";
import { waiting } from "./schema";
import { waitingStatus } from "@/components/myTableComponent/data";
import { utc } from "moment";
import { DataTableRowActions } from "./data-table-row-actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const columns: ColumnDef<waiting>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="waiting ID" />
    ),
    cell: ({ row }) => <div>{row.getValue("id")}</div>,
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => <div>{row.getValue("name")}</div>,
  },
  {
    accessorKey: "phone",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone" />
    ),
    cell: ({ row }) => (
      <div>
        {(row.getValue("phone") as string).replace(
          /(\d{4})(\d{3})(\d{4})/,
          "$1 $2 $3"
        )}
      </div>
    ),
  },
  {
    accessorKey: "Doctor",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Doctor" />
    ),
    cell: ({ row }) => (
      <div className="flex gap-2 items-center w-40">
        <Avatar>
          <AvatarImage src={row.original.Doctor.image || ""} />
          <AvatarFallback>{row.original.Doctor.name.charAt(0)}</AvatarFallback>
        </Avatar>
        {row.original.Doctor.name}
      </div>
    ),
  },
  {
    accessorKey: "DoctorType",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="DoctorType" />
    ),
    cell: ({ row }) => <div>{row.original.DoctorType.name}</div>,
  },

  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created at" />
    ),
    cell: ({ row }) => (
      <div>
        {utc(new Date(row.getValue("createdAt"))).format(
          "DD/MM/YYYY - hh:mm A"
        )}
      </div>
    ),
    enableSorting: true,
  },

  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = waitingStatus.find(
        (status) => status.value === row.getValue("status")
      );

      if (!status) {
        return null;
      }

      return (
        <div className="flex min-w-max items-center">
          {status.icon && (
            <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          <span>{status.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    header: () => <div>Actions</div>,
    id: "actions",
    cell: ({ row }) => {
      const status = waitingStatus.find(
        (status) => status.value === row.getValue("status")
      );

      if (!status) {
        return null;
      }
      return row.getValue("status") === "pending" ? (
        <DataTableRowActions row={row} />
      ) : (
        <TooltipProvider delayDuration={50}>
          <Tooltip>
            <TooltipTrigger>
              <div className="bg-secondary grid place-content-center rounded h-9 w-9">
                {status?.icon && (
                  <status.icon className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <div>
                This Waiting is <b>{status?.label}</b>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
];

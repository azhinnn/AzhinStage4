"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/myTableComponent/data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { discount } from "./schema";
import { utc } from "moment";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowRightCircle } from "lucide-react";

export const columns: ColumnDef<discount>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
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
    cell: ({ row }) => <div className="min-w-max">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "code",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Code" />
    ),
    cell: ({ row }) => <div>{row.getValue("code")}</div>,
  },
  {
    accessorKey: "Doctor",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Doctor" />
    ),
    cell: ({ row }) => (
      <div className="flex gap-2 items-center min-w-max">
        <Avatar>
          <AvatarImage src={row.original.Doctor.image || ""} />
          <AvatarFallback>
            {(row.getValue("Doctor") as any).name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        {(row.getValue("Doctor") as any).name}
      </div>
    ),
  },

  {
    accessorKey: "Doctortype",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="D-Type" />
    ),
    cell: ({ row }) => <div>{(row.getValue("Doctortype") as any).name}</div>,
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="New Price" />
    ),
    cell: ({ row }) => {
      const original = row.original.Doctortype.price;
      const newPrice = original * (1 - row.original.percentage / 100);

      return (
        <div className="flex items-center gap-1">
          ${(row.getValue("Doctortype") as any).price}
          <ArrowRightCircle className="text-red-500 h-5" />$
          {newPrice.toFixed(2) || 0}{" "}
          <Badge variant="destructive">{row.original.percentage}%</Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "startDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Start Date" />
    ),
    cell: ({ row }) => (
      <div>{utc(new Date(row.getValue("startDate"))).format("DD/MM/YYYY")}</div>
    ),
  },
  {
    accessorKey: "endDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="End Date" />
    ),
    cell: ({ row }) => (
      <div>{utc(new Date(row.getValue("endDate"))).format("DD/MM/YYYY")}</div>
    ),
  },

  {
    header: () => <div>Actions</div>,
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];

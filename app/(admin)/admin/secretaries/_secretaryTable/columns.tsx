"use client";

import { ColumnDef } from "@tanstack/react-table";

import { secretary } from "./schema";
import { DataTableColumnHeader } from "@/components/myTableComponent/data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const columns: ColumnDef<secretary>[] = [
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
    cell: ({ row }) => (
      <div className="flex gap-2 items-center min-w-max">
        <Avatar>
          <AvatarImage src={row.original.image || ""} />
          <AvatarFallback>
            {(row.getValue("name") as string).charAt(0)}
          </AvatarFallback>
        </Avatar>
        {row.getValue("name")}
      </div>
    ),
  },
  {
    accessorKey: "phone",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone" />
    ),
    cell: ({ row }) => {
      const phoneNumber = row.getValue("phone") as string;
      const formattedPhoneNumber = phoneNumber.replace(
        /(\d{4})(\d{3})(\d{4})/,
        "$1 $2 $3"
      );
      return <div className="min-w-max">{formattedPhoneNumber}</div>;
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => <div>{row.getValue("email")}</div>,
  },
  {
    accessorKey: "gender",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Gender" />
    ),
    cell: ({ row }) => (
      <div className="capitalize">
        {row.getValue("gender") === "notSelected"
          ? "Not Selected"
          : row.getValue("gender")}
      </div>
    ),
  },
  {
    header: () => <div>Actions</div>,
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];

"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/myTableComponent/data-table-column-header";
import { doctorField } from "./schema";

export const columns: ColumnDef<doctorField>[] = [
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
      <div className="flex gap-2 items-center">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "Types",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Types" />
    ),
    cell: ({ row }) => <div>{row.original._count.DoctorType}</div>,
  },
  {
    accessorKey: "Doctors",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Doctors" />
    ),
    cell: ({ row }) => <div>{row.original._count.Doctor}</div>,
  },
];

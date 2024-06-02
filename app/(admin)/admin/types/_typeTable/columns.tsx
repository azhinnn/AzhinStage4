"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/myTableComponent/data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { doctorType } from "./schema";

export const columns: ColumnDef<doctorType>[] = [
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
    accessorKey: "field",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Filed" />
    ),
    cell: ({ row }) => (
      <div className="flex gap-2 items-center">
        {row.original.DoctorField.name}
      </div>
    ),
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Price" />
    ),
    cell: ({ row }) => <div>$ {row.getValue("price")}</div>,
  },
  {
    accessorKey: "doctor",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Doctor" />
    ),
    cell: ({ row }) => (
      <div>
        {row.original.Doctor?.length ? (
          row.original.Doctor.map((doc) => doc.name).join(", ")
        ) : (
          <span className="text-muted-foreground">
            &quot;Not-Selected&quot;
          </span>
        )}
      </div>
    ),
  },
  {
    accessorKey: "Doctor ID",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Doctor ID" />
    ),
    cell: ({ row }) => (
      <div>
        {row.original.Doctor?.length ? (
          row.original.Doctor.map((doc) => doc.id).join(", ")
        ) : (
          <span className="text-muted-foreground">
            &quot;Not-Selected&quot;
          </span>
        )}
      </div>
    ),
  },

  {
    header: () => <div>Actions</div>,
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];

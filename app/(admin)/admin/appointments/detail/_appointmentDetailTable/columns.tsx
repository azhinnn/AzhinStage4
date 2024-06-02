"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/myTableComponent/data-table-column-header";
import { visit } from "./schema";
import { visitStatus } from "@/components/myTableComponent/data";
import { utc } from "moment";

export const columns: ColumnDef<visit>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Visit ID" />
    ),
    cell: ({ row }) => <div>{row.getValue("id")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Visit Date" />
    ),
    cell: ({ row }) => (
      <div>
        {utc(new Date(row.getValue("date"))).format("DD/MM/YYYY - hh:mm A")}
      </div>
    ),
  },

  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Status"
        className="min-w-max"
      />
    ),
    cell: ({ row }) => {
      const status = visitStatus.find(
        (status) => status.value === row.getValue("status")
      );

      if (!status) {
        return null;
      }

      return (
        <div className="flex items-center">
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
    accessorKey: "note",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Note" />
    ),
    cell: ({ row }) => (
      <>
        {row.getValue("note") === null ? (
          <div className="text-muted-foreground truncate max-w-56">No Note</div>
        ) : (
          <div className="max-w-56 truncate">{row.getValue("note")}</div>
        )}
      </>
    ),
  },
];

"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/myTableComponent/data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { VisitSchema } from "./schema";
import { visitStatus } from "@/components/myTableComponent/data";
import { utc } from "moment";
import moment from "moment";

export const columns: ColumnDef<VisitSchema>[] = [
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
      <DataTableColumnHeader column={column} title="Patient Name" />
    ),
    cell: ({ row }) => <div>{row.getValue("name")}</div>,
  },
  {
    accessorKey: "phone",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Patient Phone" />
    ),
    cell: ({ row }) => {
      const phoneNumber = row.getValue("phone") as string;
      const formattedPhoneNumber = phoneNumber.replace(
        /(\d{4})(\d{3})(\d{4})/,
        "$1 $2 $3"
      );
      return <div>{formattedPhoneNumber}</div>;
    },
  },
  {
    accessorKey: "Type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => <div>{row.original.Appointment.DoctorType.name}</div>,
    enableSorting: false,
  },
  {
    accessorKey: "visit At",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Visit At" />
    ),
    cell: ({ row }) => {
      return (
        <div className="min-w-max">
          {utc(row.original.date).format("DD/MM/YYYY hh:mm A")}
        </div>
      );
    },
    sortingFn: (rowA, rowB) => {
      const dateA = moment(rowA.original.date);
      const dateB = moment(rowB.original.date);
      return dateA.diff(dateB);
    },
    sortDescFirst: true,
  },

  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = visitStatus.find(
        (status) => status.value === row.getValue("status")
      );

      if (!status) {
        return null;
      }

      return (
        <div className="flex w-[120px] items-center">
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
    enableSorting: false,
  },

  {
    header: () => <div>Actions</div>,
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];

"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/myTableComponent/data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { VisitSchema } from "./schema";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
    accessorKey: "pname",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Patient Name" />
    ),
    cell: ({ row }) => <div>{row.getValue("pname")}</div>,
  },
  {
    accessorKey: "pphone",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Patient Phone" />
    ),
    cell: ({ row }) => {
      const phoneNumber = row.getValue("pphone") as string;
      const formattedPhoneNumber = phoneNumber.replace(
        /(\d{4})(\d{3})(\d{4})/,
        "$1 $2 $3"
      );
      return <div>{formattedPhoneNumber}</div>;
    },
  },
  {
    accessorKey: "Doctor Name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Doctor Name" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-2 min-w-max">
        <Avatar>
          <AvatarImage src={row.original.Appointment.Doctor?.image || ""} />
          <AvatarFallback>
            {row.original.Appointment.Doctor.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        {row.original.Appointment.Doctor.name}
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "Field",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Field" />
    ),
    cell: ({ row }) => (
      <div>{row.original.Appointment.DoctorType.DoctorField.name}</div>
    ),
    enableSorting: false,
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
    accessorKey: "visitDate",
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
    enableSorting: false,
  },

  {
    header: () => <div>Actions</div>,
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];

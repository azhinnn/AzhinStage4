"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/myTableComponent/data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { appointment } from "./schema";
import { appointmentStatus } from "@/components/myTableComponent/data";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { utc } from "moment";
import moment from "moment";

export const columns: ColumnDef<appointment>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="App ID"
        className="min-w-max"
      />
    ),
    cell: ({ row }) => (
      <div className="min-w-max text-center">{row.getValue("id")}</div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Patient" />
    ),
    cell: ({ row }) => (
      <Link
        href={`/secretary/patients/update?id=${row.original.Patient.id}`}
        className="flex items-center gap-2 underline underline-offset-2 min-w-max">
        {row.getValue("name")}
      </Link>
    ),
  },
  {
    accessorKey: "phone",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone" />
    ),
    cell: ({ row }) => {
      const phoneNumber = row.original.Patient.phone;
      const formattedPhoneNumber = phoneNumber.replace(
        /(\d{4})(\d{3})(\d{4})/,
        "$1 $2 $3"
      );
      return <div className="min-w-max">{formattedPhoneNumber}</div>;
    },
  },
  {
    accessorKey: "dName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Doctor" />
    ),
    cell: ({ row }) => (
      <div className="flex gap-2 items-center min-w-max">
        <Avatar>
          <AvatarImage src={row.original.Doctor.image || ""} />
          <AvatarFallback>
            {(row.getValue("dName") as string).charAt(0)}
          </AvatarFallback>
        </Avatar>
        {row.getValue("dName")}
      </div>
    ),
  },
  {
    accessorKey: "Field",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Field" />
    ),
    cell: ({ row }) => <div>{row.original.DoctorType.DoctorField.name}</div>,
  },
  {
    accessorKey: "Type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => <div>{row.original.DoctorType.name}</div>,
  },
  {
    accessorKey: "visit At",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Visit At" />
    ),
    cell: ({ row }) => {
      return (
        <div className="min-w-max">
          {utc(row.original.visitDate).format("DD/MM/YYYY hh:mm A")}
        </div>
      );
    },
    sortingFn: (rowA, rowB) => {
      const dateA = moment(rowA.original.visitDate);
      const dateB = moment(rowB.original.visitDate);
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
      const status = appointmentStatus.find(
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
  },
  {
    header: () => <div>Actions</div>,
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];

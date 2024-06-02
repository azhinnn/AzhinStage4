"use client";

import { ColumnDef } from "@tanstack/react-table";
import { transaction } from "./schema";
import { DataTableColumnHeader } from "@/components/myTableComponent/data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { utc } from "moment";
import Link from "next/link";
import { PlusCircle, MinusCircle } from "lucide-react";

export const columns: ColumnDef<transaction>[] = [
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
    accessorKey: "patient",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Patient" />
    ),
    cell: ({ row }) => (
      <Link
        href={`/secretary/patients/update?id=${row.original.Appointment.Patient.id}`}
        className="underline font-bold">
        {row.getValue("patient")}
      </Link>
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
    accessorKey: "Appointment",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="App ID" />
    ),
    cell: ({ row }) => (
      <Link
        href={`/secretary/appointments/detail?id=${row.original.Appointment.id}`}
        className="underline font-bold">
        {row.original.Appointment.id}
      </Link>
    ),
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
    cell: ({ row }) => <div>$ {row.getValue("amount")}</div>,
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-1 capitalize min-w-maxs">
        {row.getValue("type") === "payment" ? (
          <PlusCircle className="text-green-500 w-4 h-4" />
        ) : (
          <MinusCircle className="text-red-500 w-4 h-4" />
        )}{" "}
        {row.getValue("type")}
      </div>
    ),
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => {
      return (
        <div className="min-w-max">
          {utc(new Date(row.getValue("date"))).format("DD/MM/YYYY - hh:mm A")}
        </div>
      );
    },
    enableSorting: false,
  },
  {
    header: () => <div>Actions</div>,
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];

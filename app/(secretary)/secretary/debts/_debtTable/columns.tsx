"use client";

import { ColumnDef } from "@tanstack/react-table";
import { transaction } from "./schema";
import { DataTableColumnHeader } from "@/components/myTableComponent/data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export const columns: ColumnDef<transaction>[] = [
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
      <Link
        href={`/secretary/appointments/detail?id=${row.getValue("id")}`}
        className="text-center font-bold underline">
        {row.getValue("id")}
      </Link>
    ),
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
        href={`/secretary/patients/update?id=${row.original.Patient.id}`}
        className="font-bold underline">
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
    accessorKey: "price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Service Price" />
    ),
    cell: ({ row }) => {
      if (row.original.Discount) {
        const discountPercentage = row.original?.Discount?.percentage || 0;
        const coastAfterDiscount =
          row.original.DoctorType.price * (1 - discountPercentage / 100);
        return (
          <div>
            ${coastAfterDiscount.toFixed(2)}{" "}
            <Badge variant={"destructive"}>{discountPercentage}%</Badge>
          </div>
        );
      } else {
        return <div>${row.original.DoctorType.price.toFixed(2)}</div>;
      }
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Paid Amount" />
    ),
    cell: ({ row }) => (
      <div>
        ${" "}
        {row.original.Transaction.map((t) => t.amount).reduce(
          (a, b) => a + b,
          0
        )}
      </div>
    ),
  },
  {
    accessorKey: "remaining",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Remaining (Debt)" />
    ),
    cell: ({ row }) => {
      const serviceCoast = row.original.DoctorType.price;

      const discountPercentage = row.original?.Discount?.percentage || 0;
      const coastAfterDiscount = serviceCoast * (1 - discountPercentage / 100);

      const remaining =
        coastAfterDiscount -
        row.original.Transaction.reduce((a, b) => a + b.amount, 0);

      return <div>${remaining.toFixed(2)}</div>;
    },
  },
  {
    header: () => <div>Actions</div>,
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];

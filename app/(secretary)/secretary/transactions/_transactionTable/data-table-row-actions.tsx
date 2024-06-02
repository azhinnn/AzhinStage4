"use client";

import { Row } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { transactionchema } from "./schema";
import { DollarSign, FileDownIcon, Info } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import TransactionPdf from "@/components/pdf/transaction-pdf";
import { useEffect, useState } from "react";
import { getCurrency } from "@/helper/currencyActions";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const transaction = transactionchema.parse(row.original);
  const [currency, setCurrency] = useState(0);

  const router = useRouter();

  const pdfPropValues = {
    // companyName: transaction.Appointment.companyName,
    transactionId: transaction.id,
    appointmentId: transaction.Appointment.id,
    doctorName: transaction.Appointment.Doctor.name,
    doctorField: transaction.Appointment.DoctorType.DoctorField.name,
    doctorType: transaction.Appointment.DoctorType.name,
    patientName: transaction.Appointment.Patient.name,
    patientPhone: transaction.Appointment.Patient.phone,
    transactionDate: transaction.date,
    transactionAmount: transaction.amount,
    transactionType: transaction.type,
  };

  useEffect(() => {
    async function fetchData() {
      const res = await getCurrency();
      setCurrency(res.data.price);
    }
    fetchData();
  }, []);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem
          onClick={() =>
            router.push(
              `/secretary/transactions/detail?id=${transaction.Appointment.id}`
            )
          }>
          Detail
          <DropdownMenuShortcut className="opacity-100">
            <Info className="w-4 h-4" />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <TransactionPdf props={pdfPropValues} currency={currency} />
          <DropdownMenuShortcut className="opacity-100">
            <FileDownIcon className="w-4 h-4" />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() =>
            router.push(
              `/secretary/transactions/add?appid=${transaction.Appointment.id}`
            )
          }>
          Add Payment
          <DropdownMenuShortcut className="opacity-100">
            <DollarSign className="w-4 h-4" />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

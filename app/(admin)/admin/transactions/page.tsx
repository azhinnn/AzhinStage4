import { DataTable } from "@/components/myTableComponent/data-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DollarSign, Plus } from "lucide-react";
import Currency from "./_transactionTable/currency";
import { columns } from "./_transactionTable/columns";
import { getTransactions } from "@/helper/transactionActions";
import { getCurrency } from "@/helper/currencyActions";

export default async function TransactionPage() {
  const data = await getTransactions();

  // add patient column and doctor column
  data?.data.forEach((d: any) => {
    d.patient = d.Appointment.Patient.name;
    d.phone = d.Appointment.Patient.phone;
    d.doctor = d.Appointment.Doctor.name;
  });

  const currencyPrice = await getCurrency();

  return (
    <div className="space-y-8">
      <div className="flex justify-between flex-wrap gap-2">
        <h1 className="font-bold text-3xl flex items-center gap-2">
          <DollarSign className="w-8 h-8" /> Transactions
        </h1>
        <Currency
          className="ml-auto"
          currency={currencyPrice?.data?.price || 0}
        />
        <Button
          asChild
          size={"sm"}
          className="rounded-full aspect-square p-2 w-10 h-10 hover:rotate-90 transition-transform">
          <Link href={"/admin/transactions/add"}>
            <Plus />
          </Link>
        </Button>
      </div>
      <DataTable data={data?.data || []} columns={columns} />
    </div>
  );
}

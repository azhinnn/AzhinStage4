import { DataTable } from "@/components/myTableComponent/data-table";
import { HandCoins } from "lucide-react";
import { getDebts } from "@/helper/debtActions";
import { columns } from "./_debtTable/columns";

export default async function DebtPage() {
  const data = await getDebts();

  // add patient column and doctor column
  data?.data.forEach((d: any) => {
    d.patient = d.Patient.name;
    d.phone = d.Patient.phone;
    d.doctor = d.Doctor.name;
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-between">
        <h1 className="font-bold text-3xl flex items-center gap-2">
          <HandCoins className="w-8 h-8" /> Debts
        </h1>
      </div>
      <DataTable data={data?.data || []} columns={columns} />
    </div>
  );
}

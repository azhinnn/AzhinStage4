import { DataTable } from "@/components/myTableComponent/data-table";
import { Stethoscope } from "lucide-react";
import { getSecretaries } from "@/helper/secretaryActions";
import { columns } from "./_secretaryTable/columns";

export default async function SecretaryPage() {
  const data = await getSecretaries();

  return (
    <div className="space-y-8">
      <div className="flex justify-between ">
        <h1 className="font-bold text-3xl flex items-center gap-2">
          <Stethoscope className="w-8 h-8" /> Secretaries
        </h1>
      </div>
      <DataTable data={data?.data || []} columns={columns} />
    </div>
  );
}

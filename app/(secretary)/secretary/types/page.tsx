import { DataTable } from "@/components/myTableComponent/data-table";
import { getDoctorTypes } from "@/helper/doctorTypeActions";
import { Microscope } from "lucide-react";
import { columns } from "./_typeTable/columns";

export default async function DoctorTypePage() {
  const data = await getDoctorTypes();

  return (
    <div className="space-y-8">
      <div className="flex justify-between">
        <h1 className="font-bold text-3xl flex items-center gap-2">
          <Microscope className="w-8 h-8" /> Doctor Types
        </h1>
      </div>
      <DataTable data={data?.data || []} columns={columns} />
    </div>
  );
}

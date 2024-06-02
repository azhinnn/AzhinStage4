import { DataTable } from "@/components/myTableComponent/data-table";
import { Stethoscope } from "lucide-react";
import { columns } from "./_doctorTable/columns";
import { GetDoctors } from "@/helper/doctorActions";

export default async function DoctorPage() {
  const data = await GetDoctors();

  return (
    <div className="space-y-8">
      <div className="flex justify-between ">
        <h1 className="font-bold text-3xl flex items-center gap-2">
          <Stethoscope className="w-8 h-8" /> Doctors
        </h1>
      </div>
      <DataTable data={data?.data || []} columns={columns} />
    </div>
  );
}

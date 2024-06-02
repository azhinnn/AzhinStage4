import { DataTable } from "@/components/myTableComponent/data-table";
import { FolderPlus } from "lucide-react";
import { db } from "@/lib/db";
import { columns } from "./_fieldTable/columns";
import { getDoctorFields } from "@/helper/doctorFieldActions";

export default async function DoctorFieldPage() {
  // recive data from doctorField table in the database 👇
  const data = await getDoctorFields();

  return (
    <div className="space-y-8">
      <div className="flex justify-between">
        <h1 className="font-bold text-3xl flex items-center gap-2">
          <FolderPlus className="w-8 h-8" /> Doctor Fields
        </h1>
      </div>
      <DataTable data={data?.data || []} columns={columns} />
    </div>
  );
}

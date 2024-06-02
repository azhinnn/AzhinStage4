import { DataTable } from "@/components/myTableComponent/data-table";
import { HeartPulse, Plus } from "lucide-react";
import { columns } from "./_patientTable/columns";
import { getPatients } from "@/helper/patientActions";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function PatientPage() {
  const data = await getPatients();

  return (
    <div className="space-y-8">
      <div className="flex justify-between">
        <h1 className="font-bold text-3xl flex items-center gap-2">
          <HeartPulse className="w-8 h-8" /> Patients
        </h1>
        <Button
          asChild
          size={"sm"}
          className="rounded-full aspect-square p-2 w-10 h-10 hover:rotate-90 transition-transform">
          <Link href={"/admin/patients/add"}>
            <Plus />
          </Link>
        </Button>
      </div>
      <DataTable data={data?.data || []} columns={columns} />
    </div>
  );
}

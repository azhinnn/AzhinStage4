import { DataTable } from "@/components/myTableComponent/data-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, Stethoscope } from "lucide-react";
import { GetDoctors } from "@/helper/doctorActions";
import { columns } from "./_doctorTable/columns";

export default async function DoctorPage() {
  const data = await GetDoctors();

  return (
    <div className="space-y-8">
      <div className="flex justify-between ">
        <h1 className="font-bold text-3xl flex items-center gap-2">
          <Stethoscope className="w-8 h-8" /> Doctors
        </h1>
        <Button
          asChild
          size={"sm"}
          className="rounded-full aspect-square p-2 w-10 h-10 hover:rotate-90 transition-transform">
          <Link href={"/admin/doctors/add"}>
            <Plus />
          </Link>
        </Button>
      </div>
      <DataTable data={data?.data || []} columns={columns} />
    </div>
  );
}

import { DataTable } from "@/components/myTableComponent/data-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Microscope, Plus } from "lucide-react";
import { getDoctorTypes } from "@/helper/doctorTypeActions";
import { columns } from "./_typeTable/columns";

export default async function DoctorTypePage() {
  const data = await getDoctorTypes();

  return (
    <div className="space-y-8">
      <div className="flex justify-between">
        <h1 className="font-bold text-3xl flex items-center gap-2">
          <Microscope className="w-8 h-8" /> Doctor Types
        </h1>
        <Button
          asChild
          size={"sm"}
          className="rounded-full aspect-square p-2 w-10 h-10 hover:rotate-90 transition-transform">
          <Link href={"/admin/types/add"}>
            <Plus />
          </Link>
        </Button>
      </div>
      <DataTable data={data?.data || []} columns={columns} />
    </div>
  );
}

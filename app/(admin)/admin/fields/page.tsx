import { DataTable } from "@/components/myTableComponent/data-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FolderPlus, Plus } from "lucide-react";
import { getDoctorFields } from "@/helper/doctorFieldActions";
import { columns } from "./_fieldTable/columns";

export default async function DoctorFieldPage() {
  const data = await getDoctorFields();

  return (
    <div className="space-y-8">
      <div className="flex justify-between">
        <h1 className="font-bold text-3xl flex items-center gap-2">
          <FolderPlus className="w-8 h-8" /> Doctor Fields
        </h1>
        <Button
          asChild
          size={"sm"}
          className="rounded-full aspect-square p-2 w-10 h-10 hover:rotate-90 transition-transform">
          <Link href={"/admin/fields/add"}>
            <Plus />
          </Link>
        </Button>
      </div>
      <DataTable data={data?.data || []} columns={columns} />
    </div>
  );
}

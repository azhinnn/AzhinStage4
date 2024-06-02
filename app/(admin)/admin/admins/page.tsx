import { DataTable } from "@/components/myTableComponent/data-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, Shield } from "lucide-react";
import { getAdmins } from "@/helper/adminActions";
import { columns } from "./_adminTable/columns";

export default async function AdminPage() {
  const data = await getAdmins();

  return (
    <div className="space-y-8">
      <div className="flex justify-between">
        <h1 className="font-bold text-3xl flex items-center gap-2">
          <Shield className="w-8 h-8" /> Admins
        </h1>
        <Button
          asChild
          size={"sm"}
          className="rounded-full aspect-square w-10 h-10 p-2 hover:rotate-90 transition-transform">
          <Link href={"/admin/admins/add"}>
            <Plus />
          </Link>
        </Button>
      </div>
      <DataTable data={data?.data || []} columns={columns} />
    </div>
  );
}

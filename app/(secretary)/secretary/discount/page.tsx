import { DataTable } from "@/components/myTableComponent/data-table";
import { Plus, TicketPercent } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getDiscounts } from "@/helper/discountActions";
import { columns } from "./_discountTable/columns";

export default async function DiscountPage() {
  const data = await getDiscounts();

  return (
    <div className="space-y-8">
      <div className="flex justify-between">
        <h1 className="font-bold text-3xl flex items-center gap-2">
          <TicketPercent className="w-8 h-8" /> Discounts
        </h1>
        <Button
          asChild
          size={"sm"}
          className="rounded-full aspect-square p-2 w-10 h-10 hover:rotate-90 transition-transform">
          <Link href={"/secretary/discount/add"}>
            <Plus />
          </Link>
        </Button>
      </div>
      <DataTable data={data?.data || []} columns={columns} />
    </div>
  );
}

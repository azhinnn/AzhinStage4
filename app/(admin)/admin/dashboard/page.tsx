import dynamic from "next/dynamic";
import TransactionTable from "./_Tables/TransactionTable";
import InfoCards from "./_Cards/infoCards";
import { LayoutDashboard } from "lucide-react";

const MyChart = dynamic(() => import("./_Charts/AreaCh"), { ssr: false });

export default async function Page() {
  return (
    <div className="space-y-14">
      <h1 className="font-bold text-3xl flex items-center gap-2">
        <LayoutDashboard className="w-8 h-8" /> Dashboard
      </h1>
      <InfoCards />
      <MyChart />
      <TransactionTable />
    </div>
  );
}

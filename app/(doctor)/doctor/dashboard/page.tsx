import { LayoutDashboard } from "lucide-react";
import InfoCards from "./_Cards/infoCards";

export default function Page() {
  return (
    <div className="space-y-4">
      <h1 className="font-bold text-3xl flex items-center gap-2">
        <LayoutDashboard className="w-8 h-8" /> Dashboard
      </h1>
      <InfoCards />
    </div>
  );
}

import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { redirect } from "next/navigation";
import { LineChartIcon } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import TypeCharts from "./type-charts";
import {
  doctorTypeAnalyticData,
  getDoctorType,
} from "@/helper/doctorTypeActions";

export default async function Page({
  searchParams,
}: {
  searchParams: { id: number };
}) {
  const data = await getDoctorType(searchParams.id);
  if (!data?.data) return redirect("/admin/types");

  const type = data?.data;

  const rew = await doctorTypeAnalyticData({
    doctorTypeId: searchParams.id,
    from: undefined,
    to: undefined,
  });

  return (
    <div className="space-y-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/analytics">Analytics</BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Type Analytic</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <h1 className="font-semibold text-lg md:text-xl flex items-center gap-2 ">
        <LineChartIcon className="w-6 h-6" /> Type Analytics
      </h1>
      {/* Type Detail 👇 */}
      <Card>
        <CardContent className="mt-4 space-y-4">
          <div className="grid lg:grid-cols-3 gap-4 mt-4">
            <Label className="space-y-2 w-full text-md">
              <span>Type Name</span>
              <Input readOnly placeholder="Type Name" value={type?.name} />
            </Label>
            <Label className="space-y-2 w-full text-md">
              <span>Filed Types</span>
              <Input
                readOnly
                placeholder="Type types"
                value={type?.DoctorField.name}
              />
            </Label>
          </div>
        </CardContent>
      </Card>
      <TypeCharts
        appointments={rew.appointments}
        appointmentStatus={rew.appointmentStatus}
        visits={rew.visits}
        visitsDate={rew.visitsDate}
        visitStatus={rew.visitStatus}
        transactions={rew.transactions}
        transactionAmount={rew.transactionAmount}
        transactionDate={rew.transactionDate}
        waitings={rew.waitings}
        searchParams={searchParams.id}
      />
    </div>
  );
}

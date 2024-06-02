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
import FieldCharts from "./field-charts";
import {
  doctorFieldAnalyticData,
  getDoctorField,
} from "@/helper/doctorFieldActions";

export default async function Page({
  searchParams,
}: {
  searchParams: { id: number };
}) {
  const data = await getDoctorField(searchParams.id);
  if (!data?.data) return redirect("/admin/fields");

  const field = data?.data;

  const rew = await doctorFieldAnalyticData({
    doctorFieldId: searchParams.id,
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
            <BreadcrumbPage>Field Analytic</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <h1 className="font-semibold text-lg md:text-xl flex items-center gap-2 ">
        <LineChartIcon className="w-6 h-6" /> Field Analytics
      </h1>
      {/* Field Detail 👇 */}
      <Card>
        <CardContent className="mt-4 space-y-4">
          <div className="grid lg:grid-cols-3 gap-4 mt-4">
            <Label className="space-y-2 w-full text-md">
              <span>Field Name</span>
              <Input readOnly placeholder="Field Name" value={field?.name} />
            </Label>
            <Label className="space-y-2 w-full text-md">
              <span>Filed Types</span>
              <Input
                readOnly
                placeholder="Field types"
                value={field?.DoctorType.map((i: any) => i.name).join(", ")}
              />
            </Label>
          </div>
        </CardContent>
      </Card>
      <FieldCharts
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

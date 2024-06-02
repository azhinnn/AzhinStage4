import { DoctorAnalyticData, GetDoctor } from "@/helper/doctorActions";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import DoctorCharts from "./doctor-charts";

export default async function Page({
  searchParams,
}: {
  searchParams: { id: number };
}) {
  const data = await GetDoctor(searchParams.id);
  if (!data?.data) return redirect("/admin/doctors");

  const doctor = data?.data;

  const rew = await DoctorAnalyticData({
    doctorId: searchParams.id,
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
            <BreadcrumbPage>Doctor Analytic</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <h1 className="font-semibold text-lg md:text-xl flex items-center gap-2 ">
        <LineChartIcon className="w-6 h-6" /> Doctor Analytics
      </h1>
      {/* Doctor Detail 👇 */}
      <Card>
        <CardContent className="mt-4 space-y-4">
          <Label className="text-md ">Doctor Detail</Label>
          <Avatar className="w-20 h-20">
            <AvatarImage src={doctor.image || ""} />
            <AvatarFallback>{doctor?.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="grid lg:grid-cols-3 gap-4 mt-4">
            <Label className="space-y-2 w-full">
              <span>Full Name</span>
              <Input readOnly placeholder="Doctor Name" value={doctor?.name} />
            </Label>
            <Label className="space-y-2">
              <span>Phone</span>
              <Input
                readOnly
                placeholder="Doctor Phone"
                value={doctor?.phone}
              />
            </Label>
            <Label className="space-y-2">
              <span>Email</span>
              <Input
                readOnly
                placeholder="Doctor Email"
                value={doctor?.email}
              />
            </Label>
            <Label className="space-y-2">
              <span>Field</span>
              <Input
                readOnly
                placeholder="Speciality"
                value={doctor?.DoctorField?.name}
              />
            </Label>
            <Label className="space-y-2">
              <span>Type</span>
              <Input
                readOnly
                placeholder="Experience"
                value={doctor?.DoctorType?.map((t: any) => t.name).join(", ")}
              />
            </Label>
          </div>
        </CardContent>
      </Card>
      <DoctorCharts
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

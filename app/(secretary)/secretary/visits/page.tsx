import { DataTable } from "@/components/myTableComponent/data-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRightLeft, Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { tz } from "moment-timezone";
import { columns } from "./_visitTable/columns";
import { getDoctorVisits } from "@/helper/visitActoins";

export default async function DoctorVisitPage() {
  const data = await getDoctorVisits();

  // add extra column to the data 👇
  data?.data?.forEach((d: any) => {
    d.pname = d.Appointment.Patient.name;
    d.pphone = d.Appointment.Patient.phone;
  });

  // Function to filter and sort visits based on conditions
  const filterAndSortVisits = (
    data: any[],
    filterCondition: (visit: any) => boolean
  ) => {
    return data.filter(filterCondition).sort((a: any, b: any) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime(); // Descending order
    });
  };

  // return only those visits that are in the 👉future👈 and the status is 👉checkedIn👈
  const currentVisits = filterAndSortVisits(
    data?.data,
    (visit) =>
      new Date(visit.date).getTime() >
        new Date(
          tz("Asia/Baghdad").format("YYYY-MM-DDTHH:mm:ss.SSS[Z]")
        ).getTime() && visit.status === "checkedIn"
  );

  // return only those visits that are in the 👉past👈 and the status is 👉checkedIn👈
  const decideVisits = filterAndSortVisits(
    data?.data,
    (visit) =>
      new Date(visit.date).getTime() <
        new Date(
          tz("Asia/Baghdad").format("YYYY-MM-DDTHH:mm:ss.SSS[Z]")
        ).getTime() && visit.status === "checkedIn"
  );

  // return only those visits that are in the 👉past👈 and the status is 👉not checkedIn👈
  const pastVisits = filterAndSortVisits(
    data?.data,
    (visit) => visit.status !== "checkedIn"
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between">
        <h1 className="font-bold text-3xl flex items-center gap-2">
          <ArrowRightLeft className="w-8 h-8" /> Visits
        </h1>
        <Button
          asChild
          size={"sm"}
          className="rounded-full aspect-square p-2 w-10 h-10 hover:rotate-90 transition-transform">
          <Link href={"/secretary/visits/add"}>
            <Plus />
          </Link>
        </Button>
      </div>
      <Separator />

      <div className="space-y-8">
        <div className="flex justify-between">
          <h1 className="font-bold text-xl flex items-center gap-2">
            <ArrowRightLeft className="w-8 h-8" /> Decide
          </h1>
        </div>
        <DataTable data={decideVisits || []} columns={columns} />
      </div>
      <Separator />

      <div className="space-y-8">
        <div className="flex justify-between">
          <h1 className="font-bold text-xl flex items-center gap-2">
            <ArrowRightLeft className="w-8 h-8" /> Current
          </h1>
        </div>
        <DataTable data={currentVisits || []} columns={columns} />
      </div>
      <Separator />

      <div className="space-y-8">
        <div className="flex justify-between">
          <h1 className="font-bold text-xl flex items-center gap-2">
            <ArrowRightLeft className="w-8 h-8" /> Past Visits
          </h1>
        </div>
        <DataTable data={pastVisits || []} columns={columns} />
      </div>
    </div>
  );
}

import { DataTable } from "@/components/myTableComponent/data-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, ScrollText } from "lucide-react";
import { db } from "@/lib/db";
import { getAppointments } from "@/helper/appointmentActions";
import { columns } from "./_appointmentTable/columns";

export default async function SecretaryAppointment() {
  const data = await getAppointments();

  // add extra column to the data 👇
  data?.data?.forEach((app: any) => {
    app.name = app.Patient.name;
    app.dName = app.Doctor.name;
    app.phone = app.Patient.phone;
    app.visitDate = app.Visit.reduce((prev: any, current: any) => {
      return new Date(current.date) > new Date() &&
        (new Date(current.date) < new Date(prev.date) ||
          new Date(prev.date) < new Date())
        ? current
        : prev;
    }, app.Visit[0].date);
  });

  // retrive all the waiting 👇
  const totalWaiting = await db.waiting.count({
    where: {
      status: "pending",
    },
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-between flex-wrap gap-3">
        <h1 className="font-bold text-3xl flex items-center gap-2">
          <ScrollText className="w-8 h-8" /> Appointments
        </h1>
        <div className="flex items-center gap-4 flex-wrap">
          <Button
            variant={totalWaiting > 0 ? "destructive" : "secondary"}
            asChild>
            <Link href={"/secretary/appointments/waiting"}>
              Waiting: {totalWaiting}
            </Link>
          </Button>
          <Button
            asChild
            size={"sm"}
            className="rounded-full aspect-square p-2 w-10 h-10 hover:rotate-90 transition-transform">
            <Link href={"/secretary/appointments/add"}>
              <Plus />
            </Link>
          </Button>
        </div>
      </div>
      <DataTable data={data?.data || []} columns={columns} />
    </div>
  );
}

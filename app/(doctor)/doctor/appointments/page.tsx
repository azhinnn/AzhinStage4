import { Metadata } from "next";
import { ScrollText } from "lucide-react";
import { getUserCookie } from "@/helper/authFunctions";
import { db } from "@/lib/db";
import { DataTable } from "@/components/myTableComponent/data-table";
import { columns } from "./_appointmentTable/columns";

export const metadata: Metadata = {
  title: "Appointments",
  description: "A appointment and issue tracker build using Tanstack Table.",
};

export default async function DoctorAppointment() {
  const { id } = (await getUserCookie()) as any;

  const data = await db.appointment.findMany({
    where: {
      doctorId: Number(id),
    },
    select: {
      id: true,
      status: true,
      Patient: {
        select: {
          id: true,
          name: true,
          phone: true,
        },
      },
      DoctorType: {
        select: {
          name: true,
          DoctorField: {
            select: {
              name: true,
            },
          },
        },
      },
      Visit: {
        select: {
          id: true,
          status: true,
          date: true,
        },
      },
    },
  });

  data?.forEach((d: any) => {
    d.name = d.Patient.name;
    d.phone = d.Patient.phone;
    d.visitDate = d.Visit.reduce((prev: any, current: any) => {
      return new Date(current.date) > new Date() &&
        (new Date(current.date) < new Date(prev.date) ||
          new Date(prev.date) < new Date())
        ? current
        : prev;
    }, d.Visit[0].date);
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-between">
        <h1 className="font-bold text-3xl flex items-center gap-2">
          <ScrollText className="w-8 h-8" /> Appointments
        </h1>
      </div>
      <DataTable data={(data as any) || []} columns={columns} />
    </div>
  );
}

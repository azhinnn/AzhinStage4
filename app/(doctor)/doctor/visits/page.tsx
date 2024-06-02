import { Metadata } from "next";
import { columns } from "./_visitTable/columns";
import { DataTable } from "@/components/myTableComponent/data-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRightLeft, FolderPlus, Microscope, Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { tz, utc } from "moment-timezone";
import { db } from "@/lib/db";
import { getUserCookie } from "@/helper/authFunctions";
import { AppointmentCard } from "@/components/myCards/AppointmentCard";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { visitStatus } from "@/components/myTableComponent/data";

export const metadata: Metadata = {
  title: "Doctor - Visits",
  description: "A Visit and issue tracker build using Tanstack Table.",
};

export default async function DoctorVisitPage() {
  const { id } = (await getUserCookie()) as any;

  const data = await db.visit.findMany({
    where: {
      Appointment: {
        doctorId: Number(id),
      },
    },
    include: {
      Appointment: {
        include: {
          Doctor: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          DoctorType: {
            select: {
              id: true,
              name: true,
              price: true,
              DoctorField: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          Patient: {
            select: {
              id: true,
              name: true,
              phone: true,
              email: true,
            },
          },
          Transaction: {
            select: {
              id: true,
              amount: true,
            },
          },
          Discount: {
            select: {
              id: true,
              code: true,
              percentage: true,
            },
          },
        },
      },
    },
  });

  data?.forEach((d: any) => {
    d.name = d.Appointment.Patient.name;
    d.phone = d.Appointment.Patient.phone;
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

  const currentVisits = filterAndSortVisits(
    data,
    (visit) =>
      new Date(visit.date).getTime() >
        new Date(
          tz("Asia/Baghdad").format("YYYY-MM-DDTHH:mm:ss.SSS[Z]")
        ).getTime() && visit.status === "checkedIn"
  );

  const decideVisits = filterAndSortVisits(
    data,
    (visit) =>
      new Date(visit.date).getTime() <
        new Date(
          tz("Asia/Baghdad").format("YYYY-MM-DDTHH:mm:ss.SSS[Z]")
        ).getTime() && visit.status === "checkedIn"
  );

  const pastVisits = filterAndSortVisits(
    data,
    (visit) => visit.status !== "checkedIn"
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between">
        <h1 className="font-bold text-3xl flex items-center gap-2">
          <ArrowRightLeft className="w-8 h-8" /> Visits
        </h1>
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

function VisitCard(props: any) {
  const visit = props.visit || null;

  const status = visitStatus.find((status) => status.value === visit?.status);

  return (
    <Link href={`/doctor/appointments/detail?appid=${visit?.id}`}>
      <Card className="drop-shadow-md min-w-fit hover:bg-card/80 transition-colors">
        <CardHeader className="sm:flex-row sm:justify-between items-start sm:items-center gap-4">
          <CardTitle className="flex items-center gap-3">
            <Avatar className="w-14 h-14">
              <AvatarImage
                src={visit.Appointment?.Patient?.image || ""}
                className="object-cover"
              />
              <AvatarFallback>
                {visit.Appointment?.Patient?.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h1 className="font-bold">{visit.Appointment?.Patient?.name}</h1>
              <p className="text-muted-foreground text-sm">
                {visit.Appointment?.Patient?.phone?.replace(
                  /(\d{4})(\d{3})(\d{4})/,
                  "$1 $2 $3"
                )}
              </p>
            </div>
          </CardTitle>
          <Badge className="flex gap-1 items-center min-w-max">
            {status?.icon && <status.icon className="w-3 h-3 mr-1" />}
            {status?.label}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p className=" flex items-center gap-2">
            <FolderPlus className="w-4 h-4" />
            {visit.Appointment?.DoctorType?.DoctorField?.name}
          </p>
          <p className=" flex items-center gap-2">
            <Microscope className="w-4 h-4" />
            {visit.Appointment?.DoctorType?.name}
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            <ArrowRightLeft className="w-4 h-4" />
            {utc(visit?.date).format("DD/MM/YYYY - hh:mm A")}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowRightLeft,
  Circle,
  FolderPlus,
  Microscope,
  Plus,
  ScrollText,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getUserCookie } from "@/helper/authFunctions";
import { db } from "@/lib/db";
import {
  appointmentStatus,
  visitStatus,
} from "@/components/myTableComponent/data";
import { utc } from "moment";
import Link from "next/link";
import moment from "moment";
import { Button } from "@/components/ui/button";

export default async function Page() {
  const { id } = (await getUserCookie()) as any;

  const data = await db.appointment.findMany({
    where: {
      patientId: Number(id),
    },
    select: {
      id: true,
      status: true,
      Doctor: {
        select: {
          name: true,
          image: true,
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
      //   select last visit
      Visit: {
        select: {
          status: true,
          date: true,
        },
      },
    },
  });

  const totalPending = await db.waiting.count({
    where: {
      patientId: Number(id),
      status: "pending",
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="font-bold text-3xl flex items-start gap-2">
          <ScrollText className="w-8 h-8 drop-shadow-md" /> Appointments
        </h1>
        <div className="flex items-center gap-4 flex-wrap">
          <Button asChild className="gap-1" variant={"secondary"}>
            <Link href={"/patient/appointments/pending"}>
              <Circle className="w-4 h-4" />
              Pending: {totalPending}
            </Link>
          </Button>
          <Button
            asChild
            size={"sm"}
            className="rounded-full aspect-square p-2 w-10 h-10 hover:rotate-90 transition-transform">
            <Link href={"/patient/appointments/add"}>
              <Plus />
            </Link>
          </Button>
        </div>
      </div>
      <div className="grid gap-4 xl:grid-cols-2 md:gap-8">
        {data?.length > 0 ? (
          data.map((app) => <AppointmentCard key={app.id} {...app} />)
        ) : (
          <Card className="text-center text-muted-foreground md:col-span-2">
            <CardHeader>
              <CardTitle>No Appointment</CardTitle>
            </CardHeader>
            <CardContent>
              <p>No Appointments yet</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function AppointmentCard(props: any) {
  const app = props || null;

  const status = appointmentStatus.find(
    (status) => status.value === app.status
  );

  const closestVist = app?.Visit?.filter(
    (visit: any) => visit.status === "checkedIn"
  ).reduce((closest: any, visit: any) => {
    if (!closest) {
      closest = visit;
    }
    return Math.abs(moment().diff(visit.date)) <
      Math.abs(moment().diff(closest.date))
      ? visit
      : closest;
  }, null);

  return (
    <Link href={`/patient/appointments/detail?appid=${app.id}`}>
      <Card className="drop-shadow-md min-w-fit hover:bg-card/80 transition-colors">
        <CardHeader className="sm:flex-row sm:justify-between items-start sm:items-center gap-4">
          <CardTitle className="flex items-center gap-3">
            <Avatar>
              <AvatarImage
                src={app.Doctor?.image || ""}
                className="object-cover"
              />
              <AvatarFallback>{app.Doctor?.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="font-bold">{app.Doctor?.name}</div>
          </CardTitle>
          <Badge className="flex gap-1 items-center min-w-max">
            {status?.icon && <status.icon className="w-3 h-3 mr-1" />}
            {status?.label}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p className=" flex items-center gap-2">
            <FolderPlus className="w-4 h-4" />
            {app.DoctorType?.DoctorField?.name}
          </p>
          <p className=" flex items-center gap-2">
            <Microscope className="w-4 h-4" />
            {app.DoctorType?.name}
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            <ArrowRightLeft className="w-4 h-4" />
            {closestVist?.date && (
              <>
                {utc(closestVist?.date).format("DD/MM/YYYY - hh:mm A")}
                <Badge variant={"secondary"} className="min-w-max">
                  Checked In
                </Badge>
              </>
            )}
            {(app.status === "completed" || app.status === "cancelled") && (
              <Badge variant={"secondary"} className="min-w-max">
                {
                  visitStatus.find((status) => status.value === app.status)
                    ?.label
                }
              </Badge>
            )}
            {!closestVist?.date &&
              app.status !== "completed" &&
              app.status !== "cancelled" &&
              "No new visit"}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

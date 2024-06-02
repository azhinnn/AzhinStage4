import moment from "moment";
import { appointmentStatus, visitStatus } from "../myTableComponent/data";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { utc } from "moment";
import { FolderPlus, Microscope, ArrowRightLeft } from "lucide-react";

export function AppointmentCard(props: any) {
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
    <Link href={`/doctor/appointments/detail?appid=${app.id}`}>
      <Card className="drop-shadow-md min-w-fit hover:bg-card/80 transition-colors">
        <CardHeader className="sm:flex-row sm:justify-between items-start sm:items-center gap-4">
          <CardTitle className="flex items-center gap-3">
            <Avatar className="w-14 h-14">
              <AvatarImage
                src={app.Patient?.image || ""}
                className="object-cover"
              />
              <AvatarFallback>{app.Patient?.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h1 className="font-bold">{app.Patient?.name}</h1>
              <p className="text-muted-foreground text-sm">
                {app.Patient?.phone}
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

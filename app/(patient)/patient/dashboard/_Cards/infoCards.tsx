import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUserCookie } from "@/helper/authFunctions";
import { db } from "@/lib/db";
import { ScrollText, ArrowRightLeftIcon, SquareGantt } from "lucide-react";
import { tz } from "moment-timezone";

export default async function InfoCards() {
  const iraqTime = tz("Asia/Baghdad").format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
  const lastWeekEnd = new Date(
    Number(new Date(iraqTime)) - 7 * 24 * 60 * 60 * 1000
  );
  const { id } = (await getUserCookie()) as any;

  const [totalAppointments, newAppointments, totalVisits, newVisits] =
    await Promise.all([
      db.appointment.count({
        where: {
          patientId: Number(id),
        },
      }),
      db.appointment.count({
        where: {
          patientId: Number(id),
          date: {
            gte: lastWeekEnd,
          },
        },
      }),
      db.visit.count({
        where: {
          Appointment: {
            patientId: Number(id),
          },
        },
      }),
      db.visit.count({
        where: {
          Appointment: {
            patientId: Number(id),
          },
          date: {
            gte: lastWeekEnd,
          },
        },
      }),
    ]);

  return (
    <div className="space-y-4">
      <h1 className="font-semibold text-lg md:text-xl flex items-center gap-2">
        <SquareGantt className="w-6 h-6" /> Overview
      </h1>
      <main className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3 md:gap-8">
        <Card className="hover:bg-card/80 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">
              Total Appointments
            </CardTitle>
            <ScrollText className="w-8 h-8 text-green-500 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalAppointments || 0}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              <b>{newAppointments || 0}</b> New Appointments Last Week
            </p>
          </CardContent>
        </Card>
        <Card className="hover:bg-card/80 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Visits</CardTitle>
            <ArrowRightLeftIcon className="w-8 h-8 text-orange-500 dark:text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalVisits || 0}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              <b>{newVisits || 0}</b> New Visits Last Week
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { db } from "@/lib/db";
import {
  HeartPulse,
  ScrollText,
  ArrowRightLeftIcon,
  SquareGantt,
} from "lucide-react";
import { tz } from "moment-timezone";

export default async function InfoCards() {
  const iraqTime = tz("Asia/Baghdad").format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
  const lastWeekEnd = new Date(
    Number(new Date(iraqTime)) - 7 * 24 * 60 * 60 * 1000
  );

  const [
    totalAppointments,
    newAppointments,
    totalPatients,
    newPatients,
    totalTransactions,
    newTransactions,
  ] = await Promise.all([
    db.appointment.count(),
    db.appointment.count({
      where: {
        date: {
          gte: lastWeekEnd,
        },
      },
    }),
    db.patient.count(),
    db.patient.count({
      where: {
        createdAt: {
          gte: lastWeekEnd,
        },
      },
    }),
    db.transaction.count(),
    db.transaction.count({
      where: {
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
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">
              Total Patients
            </CardTitle>
            <HeartPulse className="w-8 h-8 text-red-500 dark:text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalPatients || 0}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              <b>{newPatients || 0}</b> New Patients Last Week
            </p>
          </CardContent>
        </Card>
        <Card>
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
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Visits</CardTitle>
            <ArrowRightLeftIcon className="w-8 h-8 text-orange-500 dark:text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalTransactions || 0}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              <b>{newTransactions || 0}</b> New Visits Last Week
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

import {
  HeartPulse,
  ScrollText,
  ArrowRightLeftIcon,
  SquareGantt,
  DollarSign,
  Circle,
  Banknote,
} from "lucide-react";
import { tz } from "moment-timezone";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/db";

export default async function InfoCards() {
  const iraqTime = tz("Asia/Baghdad").format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
  const lastMonth = new Date(
    Number(new Date(iraqTime)) - 30 * 24 * 60 * 60 * 1000
  );
  const lastWeekEnd = new Date(
    Number(new Date(iraqTime)) - 7 * 24 * 60 * 60 * 1000
  );

  const [
    totalAppointments,
    newAppointments,
    totalPatients,
    newPatients,
    totalVisits,
    newVisits,
    totalWaitings,
    newWaitings,
    totalTransactions,
    newTransactions,
    totalRevenue,
    newRevenue,
  ] = await Promise.all([
    db.appointment.count({
      where: {
        date: {
          gte: lastWeekEnd,
        },
      },
    }),
    db.appointment.count({
      where: {
        date: {
          gte: lastWeekEnd,
        },
      },
    }),
    db.patient.count({
      where: {
        createdAt: {
          gte: lastWeekEnd,
        },
      },
    }),
    db.patient.count({
      where: {
        createdAt: {
          gte: lastWeekEnd,
        },
      },
    }),
    db.visit.count({
      where: {
        date: {
          gte: lastWeekEnd,
        },
      },
    }),
    db.visit.count({
      where: {
        date: {
          gte: lastWeekEnd,
        },
      },
    }),
    db.waiting.count({
      where: {
        createdAt: {
          gte: lastWeekEnd,
        },
      },
    }),
    db.waiting.count({
      where: {
        createdAt: {
          gte: lastWeekEnd,
        },
      },
    }),
    db.transaction.count({
      where: {
        date: {
          gte: lastMonth,
        },
      },
    }),
    db.transaction.count({
      where: {
        date: {
          gte: lastWeekEnd,
        },
      },
    }),
    db.transaction.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        date: {
          gte: lastMonth,
        },
      },
    }),
    db.transaction.aggregate({
      _sum: {
        amount: true,
      },
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
        <InfoCardComponent
          title="Total Patients"
          description="Last Week"
          value={totalPatients}
          lastWeekValue={newPatients}
          Icon={HeartPulse}
          iconColor="#dc2626"
        />

        <InfoCardComponent
          title="Total Appointments"
          description="Last Week"
          value={totalAppointments}
          lastWeekValue={newAppointments}
          Icon={ScrollText}
          iconColor="#ea580c"
        />

        <InfoCardComponent
          title="Total Visits"
          description="Last Week"
          value={totalVisits}
          lastWeekValue={newVisits}
          Icon={ArrowRightLeftIcon}
          iconColor="#ca8a04"
        />

        <InfoCardComponent
          title="Total Waitings"
          description="Last Week"
          value={totalWaitings}
          lastWeekValue={newWaitings}
          Icon={Circle}
          iconColor="#65a30d"
        />

        <InfoCardComponent
          title="Total Transactions"
          description="Last Week"
          value={totalTransactions}
          lastWeekValue={newTransactions}
          Icon={Banknote}
          iconColor="#0284c7"
        />

        <InfoCardComponent
          title="Total Revenue"
          description="Last Week"
          value={`${
            totalRevenue._sum.amount
              ?.toFixed(2)
              .replace(/\d(?=(\d{3})+\.)/g, "$&,") || 0
          } $`}
          lastWeekValue={`${newRevenue._sum.amount || 0} $`}
          Icon={DollarSign}
          iconColor="#7c3aed"
        />
      </main>
    </div>
  );
}

export function InfoCardComponent({
  title,
  description,
  value,
  lastWeekValue,
  Icon,
  iconColor,
  lastMonth,
}: any) {
  const toTwoDecimals = (num: number) => {
    return Math.round(num * 100) / 100;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">
          {title}
          {!lastMonth && (
            <span className="text-muted-foreground"> (Last Month)</span>
          )}
        </CardTitle>
        <Icon style={{ color: iconColor }} className={`w-8 h-8`} />
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold text-center my-4">
          {toTwoDecimals(value) || 0}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          <b>{lastWeekValue || (!lastMonth && 0)}</b> {description}
        </p>
      </CardContent>
    </Card>
  );
}

"use client";
import {
  ArrowRightLeftIcon,
  Banknote,
  CalendarIcon,
  Circle,
  DollarSign,
  ScrollText,
} from "lucide-react";
import { LabelledpieChart, LineChart } from "@/components/myCharts/all-charts";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { format, subDays } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { DoctorAnalyticData } from "@/helper/doctorActions";
import { InfoCardComponent } from "@/components/myCards/info-card-component";

export default function DoctorCharts({
  appointments,
  appointmentStatus,
  visits,
  visitsDate,
  visitStatus,
  transactions,
  transactionAmount,
  transactionDate,
  waitings,
  searchParams,
}: any) {
  const [myAppointments, setMyAppointments] = useState(
    appointments || undefined
  );
  const [myAppointmentsStatus, setMyAppointmentsStatus] = useState(
    appointmentStatus || []
  );
  const [myVisits, setMyVisits] = useState(visits || undefined);
  const [myVisitsDate, setMyVisitsDate] = useState(visitsDate || []);
  const [myTransactions, setMyTransactions] = useState(
    transactions || undefined
  );
  const [myWaitings, setMyWaitings] = useState(waitings || undefined);
  const [myTransactionAmount, setMyTransactionAmount] = useState(
    transactionAmount || undefined
  );

  const [myTransactionDate, setMyTransactionDate] = useState(
    transactionDate || []
  );

  const [myVisitStatus, setMyVisitStatus] = useState(visitStatus || []);

  const [date, setDate] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });

  async function OnDateChange() {
    const rew = await DoctorAnalyticData({
      doctorId: searchParams,
      from: date?.from || undefined,
      to: date?.to || undefined,
    });

    setMyAppointments(rew.appointments);
    setMyAppointmentsStatus(rew.appointmentStatus);
    setMyVisits(rew.visits);
    setMyVisitsDate(rew.visitsDate);
    setMyVisitStatus(rew.visitStatus);
    setMyTransactions(rew.transactions);
    setMyTransactionAmount(rew.transactionAmount);
    setMyTransactionDate(rew.transactionDate);
    setMyWaitings(rew.waitings);
  }

  useEffect(() => {
    OnDateChange();
  }, [date]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          onClick={() => {
            setDate({
              from: subDays(new Date(), 7),
              to: new Date(),
            });
          }}>
          This Week
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            setDate({
              from: subDays(new Date(), 30),
              to: new Date(),
            });
          }}>
          This Month
        </Button>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={"outline"}
              className={cn(
                "md:w-[300px] justify-center font-normal",
                !date && "text-muted-foreground"
              )}>
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd, y")} -{" "}
                    {format(date.to, "LLL dd, y")}
                  </>
                ) : (
                  format(date.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <InfoCardComponent
          title="Total Appointments"
          value={myAppointments}
          Icon={ScrollText}
          iconColor="#ea580c"
          lastMonth
        />
        <InfoCardComponent
          title="Total Visits"
          value={myVisits}
          Icon={ArrowRightLeftIcon}
          iconColor="#ca8a04"
          lastMonth
        />
        <InfoCardComponent
          title="Total Waitings"
          value={myWaitings}
          Icon={Circle}
          iconColor="#7c3aed"
          lastMonth
        />
        <InfoCardComponent
          title="Total Transactions"
          value={myTransactions}
          Icon={Banknote}
          iconColor="#0284c7"
          lastMonth
        />
        <InfoCardComponent
          title="Total Revenue"
          value={myTransactionAmount}
          Icon={DollarSign}
          iconColor="#65a30d"
          lastMonth
        />
      </div>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <LabelledpieChart
          className="p-8"
          title="Appointments Status"
          description={`The status of Appointments`}
          data={myAppointmentsStatus}
        />
        <LabelledpieChart
          className="p-8"
          title="Visit Status"
          description={`The status of Visit`}
          data={myVisitStatus}
        />
        <LineChart
          className="p-8"
          title="Visits"
          description={`Visit by date`}
          data={myVisitsDate}
          icon={
            <ArrowRightLeftIcon className="w-4 h-4 mb-1 mr-1 text-[#ca8a04]" />
          }
        />
        <LineChart
          className="p-8"
          title="Transactions"
          description={`Transaction by date`}
          data={myTransactionDate}
          icon={<DollarSign className="w-4 h-4 mb-1 text-[#65a30d]" />}
        />
      </div>
    </div>
  );
}

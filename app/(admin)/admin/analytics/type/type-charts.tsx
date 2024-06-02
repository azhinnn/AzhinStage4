"use client";
import {
  ArrowRightLeftIcon,
  Banknote,
  CalendarIcon,
  Circle,
  DollarSign,
  LoaderIcon,
  ScrollText,
} from "lucide-react";
import { InfoCardComponent } from "../../dashboard/_Cards/infoCards";
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
import { doctorTypeAnalyticData } from "@/helper/doctorTypeActions";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function TypeCharts({
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
  const [isLoading, setIsLoading] = useState(false);
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
    const rew = await doctorTypeAnalyticData({
      doctorTypeId: searchParams,
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
          disabled={isLoading}
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
          disabled={isLoading}
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
          <PopoverTrigger asChild disabled={isLoading}>
            <Button
              disabled={isLoading}
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

        {isLoading && (
          <TooltipProvider delayDuration={20}>
            <Tooltip>
              <TooltipTrigger>
                <Button size={"icon"}>
                  <LoaderIcon className="w-5 h-5 animate-spin" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="py-2">
                <p className="font-bold text-center">Retriving Data...</p>
                <p className="text-sm text-balance">
                  Please be patient, it may take a few seconds to retrieve the
                  data.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <InfoCardComponent
          title="Total Appointments"
          value={myAppointments || appointments}
          Icon={ScrollText}
          iconColor="#ea580c"
          lastMonth
        />
        <InfoCardComponent
          title="Total Visits"
          value={myVisits || visits}
          Icon={ArrowRightLeftIcon}
          iconColor="#ca8a04"
          lastMonth
        />
        <InfoCardComponent
          title="Total Waitings"
          value={myWaitings || waitings}
          Icon={Circle}
          iconColor="#7c3aed"
          lastMonth
        />
        <InfoCardComponent
          title="Total Transactions"
          value={myTransactions || transactions}
          Icon={Banknote}
          iconColor="#0284c7"
          lastMonth
        />
        <InfoCardComponent
          title="Total Revenue"
          value={`$${myTransactionAmount || transactionAmount}`}
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
          data={myAppointmentsStatus || appointmentStatus}
        />
        <LabelledpieChart
          className="p-8"
          title="Visit Status"
          description={`The status of Visit`}
          data={myVisitStatus || visitStatus}
        />
        <LineChart
          className="p-8"
          title="Visits"
          description={`Visit by date`}
          data={myVisitsDate || visitsDate}
          icon={
            <ArrowRightLeftIcon className="w-4 h-4 mb-1 mr-1 text-[#ca8a04]" />
          }
        />
        <LineChart
          className="p-8"
          title="Transactions"
          description={`Transaction by date`}
          data={transactionDate || myTransactionDate}
          icon={<DollarSign className="w-4 h-4 mb-1 text-[#65a30d]" />}
        />
      </div>
    </div>
  );
}

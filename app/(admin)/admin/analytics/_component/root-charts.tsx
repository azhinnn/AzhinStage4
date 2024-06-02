"use client";
import {
  NumberOfTransactionsByEachDoctor,
  NumberOfVisitsByEachDoctor,
  TotalAmountOfTransactionByEachDoctor,
  patientsByDoctors,
} from "@/helper/analyticsActions";
import {
  BarChart,
  LabelledpieChart,
  LineChart,
} from "@/components/myCharts/all-charts";
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
import {
  ArrowRightLeftIcon,
  CalendarIcon,
  DollarSignIcon,
  LoaderIcon,
  ScrollTextIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function RootCharts({ app, visit, tran1, tran2 }: any) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [patientsByDoctor, setPatientsByDoctor] = useState<any>(app);

  const [numberOfVisitsByEachDoctor, setNumberOfVisitsByEachDoctor] =
    useState<any>(visit);

  const [
    numberOfTransactionsByEachDoctor,
    setNumberOfTransactionsByEachDoctor,
  ] = useState<any>(tran1);

  const [
    totalAmountOfTransactionByEachDoctor,
    setTotalAmountOfTransactionByEachDoctor,
  ] = useState<any>(tran2);

  const [date, setDate] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });

  async function OnDateChange() {
    setIsLoading(true);
    const app = await patientsByDoctors({ from: date?.from, to: date?.to });
    const visit = await NumberOfVisitsByEachDoctor({
      from: date?.from,
      to: date?.to,
    });
    const tran1 = await NumberOfTransactionsByEachDoctor({
      from: date?.from,
      to: date?.to,
    });
    const tran2 = await TotalAmountOfTransactionByEachDoctor({
      from: date?.from,
      to: date?.to,
    });

    setPatientsByDoctor(app);
    setNumberOfVisitsByEachDoctor(visit);
    setNumberOfTransactionsByEachDoctor(tran1);
    setTotalAmountOfTransactionByEachDoctor(tran2);

    setIsLoading(false);
  }

  useEffect(() => {
    OnDateChange();
  }, [date]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 items-center">
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
      <div className="grid xl:grid-cols-2 gap-4">
        <LabelledpieChart
          className=" p-8"
          title={
            <div className="flex items-center gap-2">
              <ScrollTextIcon className="w-7 h-7 inline" /> Number of
              Appointments
            </div>
          }
          description={
            <>
              Total number of Appointments{" "}
              <b>
                {patientsByDoctor
                  ?.reduce((acc: any, curr: any) => acc + curr.value, 0)
                  .toLocaleString()}
              </b>
            </>
          }
          data={patientsByDoctor}
          keys={["value"]}
        />
        <LabelledpieChart
          className="p-8"
          title={
            <div className="flex items-center gap-2">
              <ArrowRightLeftIcon className="w-7 h-7 inline" /> Number of Visits
            </div>
          }
          description={
            <>
              Total number of patient or appointments{" "}
              <b>
                {numberOfVisitsByEachDoctor
                  ?.reduce((acc: any, curr: any) => acc + curr.value, 0)
                  .toLocaleString()}
              </b>
            </>
          }
          data={numberOfVisitsByEachDoctor}
          keys={["value"]}
        />

        <BarChart
          title={
            <div className="flex items-center gap-2">
              <DollarSignIcon className="w-7 h-7 inline" /> Number of
              Transactions
            </div>
          }
          description={
            <>
              Total number of transactions{" "}
              <b>
                {numberOfTransactionsByEachDoctor?.reduce(
                  (acc: any, curr: any) => acc + curr.value,
                  0
                )}
              </b>
            </>
          }
          data={numberOfTransactionsByEachDoctor}
          ylabel="Number of Transactions"
          xlabel="Patient"
          keys={["value"]}
        />

        <LineChart
          title={
            <div className="flex items-center gap-2">
              <DollarSignIcon className="w-7 h-7 inline" /> Total Transactions
            </div>
          }
          description={
            <>
              Total amount of transactions{" "}
              <b>
                $
                {totalAmountOfTransactionByEachDoctor
                  ?.reduce((acc: any, curr: any) => acc + curr.y, 0)
                  .toLocaleString()}
              </b>
            </>
          }
          data={totalAmountOfTransactionByEachDoctor}
          icon={<DollarSignIcon className="w-4 h-4" />}
          xlabel="Patient"
          ylabel="Amount $"
        />
      </div>
    </div>
  );
}

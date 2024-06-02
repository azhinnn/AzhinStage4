"use client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAreaChartData } from "@/helper/adminActions/adminCharts/inedx";
import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateRange } from "react-day-picker";
import { format, subDays } from "date-fns";
import { CalendarIcon, LineChart } from "lucide-react";
import { tz } from "moment-timezone";
import { Skeleton } from "@/components/ui/skeleton";

export default function AreaCh() {
  // a variable to store visit data here 👇
  const [newVisits, setNewVisits] = useState<{
    visitDates: string[];
    visitCount: number[];
  }>({
    visitDates: [],
    visitCount: [],
  });

  // a variable to store appointment data here 👇
  const [newAppointments, setNewAppointments] = useState<{
    appointmentDates: string[];
    appointmentCount: number[];
  }>({
    appointmentDates: [],
    appointmentCount: [],
  });

  // a variable to store transaction data here 👇
  const [newTransactions, setNewTransactions] = useState<{
    transactionDates: string[];
    transactionCount: number[];
  }>({
    transactionDates: [],
    transactionCount: [],
  });

  // a variable to store patient data here 👇
  const [newPatients, setNewPatients] = useState<{
    patientDates: string[];
    patientCount: number[];
  }>({ patientDates: [], patientCount: [] });

  // a variable to store date range here 👇
  const [date, setDate] = useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(tz("Asia/Baghdad").format("YYYY-MM-DDTHH:mm:ss.SSS[Z]")),
  });

  const [chartType, setChartType] = useState<"area" | "bar">("area");
  const [isLoading, setIsLoading] = useState(true);

  // fetch data from api and set state here 👇
  useEffect(() => {
    const fetchData = async () => {
      const { visitData, appointmentData, transactionData, patientData } =
        await getAreaChartData(date);

      setNewVisits(visitData);
      setNewAppointments(appointmentData);
      setNewTransactions(transactionData);
      setNewPatients(patientData);

      setIsLoading(false);
    };

    fetchData();
  }, [date]);

  return (
    <div className="space-y-4">
      {/* header 👇 */}
      <div className="flex md:items-center justify-between gap-4 flex-col md:flex-row flex-wrap">
        <h1 className="font-semibold text-lg md:text-xl flex items-center gap-2 ">
          <LineChart className="w-6 h-6" /> Analytics
        </h1>
        <div className="flex flex-wrap md:items-center gap-2 flex-col md:flex-row">
          <Select
            defaultValue="area"
            onValueChange={(e) => {
              setChartType(e as "area" | "bar");
            }}>
            <SelectTrigger className="md:w-fit gap-2">
              <SelectValue placeholder="Chart" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="area">Area</SelectItem>
              <SelectItem value="bar">Bar</SelectItem>
            </SelectContent>
          </Select>

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
      </div>
      {/* charts 👇 */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <ChartArea
          dates={newVisits.visitDates}
          visits={newVisits.visitCount}
          type={chartType}
          title="Visits"
          isLoading={isLoading}
        />
        <ChartArea
          dates={newAppointments.appointmentDates}
          visits={newAppointments.appointmentCount}
          type={chartType}
          title="Appointments"
          isLoading={isLoading}
        />
        <ChartArea
          dates={newTransactions.transactionDates}
          visits={newTransactions.transactionCount}
          type={chartType}
          title="Transactions"
          isLoading={isLoading}
        />
        <ChartArea
          dates={newPatients.patientDates}
          visits={newPatients.patientCount}
          type={chartType}
          title="Patients"
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}

function ChartArea({
  dates,
  visits,
  type,
  title,
  isLoading,
}: {
  dates: string[];
  visits: number[];
  type: "area" | "bar";
  title: string;
  isLoading: boolean;
}) {
  const [chartDate] = useState({
    options: {
      xaxis: {
        axisBorder: { show: true },
        axisTicks: { show: false },
        labels: { show: true },
      },
      yaxis: { show: false },
      grid: { show: false, padding: { left: 30, right: 0 } },

      chart: {
        sparkline: {
          enabled: false,
        },
        toolbar: {
          show: false,
        },
      },
      states: {
        hover: {
          filter: {
            type: "none",
          },
        },
        active: {
          filter: {
            type: "none",
          },
        },
      },
      tooltip: {
        enabled: false,
      },
    },
  });

  return isLoading ? (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="flex flex-col space-y-1.5 p-6">
        <div className="flex items-center justify-between">
          <Skeleton className="w-3/4 h-[20px] rounded-full" />
          <Skeleton className="w-10 h-10 rounded-full" />
        </div>
        <Skeleton className="w-1/2 h-[10px] rounded-full" />
      </div>
      <div className="p-6 pt-0">
        <Skeleton className="w-full h-[200px] rounded-lg" />
      </div>
    </div>
  ) : (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          New {title}{" "}
          <span className="bg-gray-500 aspect-square w-10 h-10 rounded-full text-primary-foreground grid place-items-center text-lg">
            {visits.reduce((a, b) => a + b, 0)}
          </span>
        </CardTitle>
        <CardDescription>
          This is an overview of your new {title}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Chart
          options={{
            ...chartDate.options,
            xaxis: { categories: dates },
          }}
          series={[{ name: title, data: visits }]}
          type={type}
          width="100%"
          height="100%"
        />
      </CardContent>
    </Card>
  );
}

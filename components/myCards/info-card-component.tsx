"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CountUp from "react-countup";

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
          {title === "Total Revenue" && "$"}
          <CountUp duration={2} end={toTwoDecimals(value) || 0} />
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          <b>{lastWeekValue || (!lastMonth && 0)}</b> {description}
        </p>
      </CardContent>
    </Card>
  );
}

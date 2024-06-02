"use client";
import { randomColorArray } from "@/components/data/colorArray";
import { visitStatus } from "@/components/myTableComponent/data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsiveLine } from "@nivo/line";
import { ResponsivePie } from "@nivo/pie";
import { ReactNode } from "react";

interface ChartProps {
  className?: string;
  title: ReactNode;
  description?: ReactNode;
  data: any;
  keys?: string[];
  icon?: React.ReactNode;
  xlabel?: string;
  ylabel?: string;
}

export function BarChart({
  className,
  title,
  description,
  data,
  keys,
  xlabel,
  ylabel,
}: ChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className={`aspect-[4/3] w-full ${className}`}>
        <ResponsiveBar
          data={data}
          tooltip={(i: any) => {
            return (
              <div className="bg-background rounded px-2 text-sm">
                <b>{i.data.value}</b> transactions from <b>{i.data.name}</b>
              </div>
            );
          }}
          keys={keys}
          indexBy="name"
          margin={{ top: 50, right: 0, bottom: 50, left: 60 }}
          padding={0.3}
          colors={randomColorArray}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: xlabel,
            legendOffset: 36,
            legendPosition: "middle",
            truncateTickAt: 0,
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            legend: ylabel,
            legendOffset: -40,
            legendPosition: "middle",
          }}
          gridYValues={4}
          theme={{
            tooltip: {
              chip: {
                borderRadius: "9999px",
              },
              container: {
                fontSize: "12px",
                textTransform: "capitalize",
                borderRadius: "6px",
              },
            },
            grid: {
              line: {
                stroke: "#f3f4f6",
              },
            },
          }}
          tooltipLabel={({ id }) => `${id}`}
          enableLabel={false}
          role="application"
          ariaLabel="A bar chart showing data"
        />
      </CardContent>
    </Card>
  );
}

export function GroupedbarChart({
  className,
  title,
  description,
  data,
  keys,
  xlabel,
  ylabel,
}: ChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className={`aspect-[4/3] w-full ${className}`}>
        <ResponsiveBar
          data={[
            { name: "Jan", desktop: 111, mobile: 99 },
            { name: "Feb", desktop: 157, mobile: 87 },
            { name: "Mar", desktop: 129, mobile: 89 },
            { name: "Apr", desktop: 187, mobile: 151 },
            { name: "May", desktop: 119, mobile: 127 },
            { name: "Jun", desktop: 20, mobile: 121 },
          ]}
          keys={["desktop", "mobile"]}
          indexBy="name"
          groupMode="grouped"
          margin={{ top: 0, right: 0, bottom: 40, left: 40 }}
          padding={0.3}
          colors={["#2563eb", "#e11d48"]}
          axisBottom={{
            tickSize: 0,
            tickPadding: 16,
          }}
          axisLeft={{
            tickSize: 0,
            tickValues: 4,
            tickPadding: 16,
          }}
          gridYValues={4}
          theme={{
            tooltip: {
              chip: {
                borderRadius: "9999px",
              },
              container: {
                fontSize: "12px",
                textTransform: "capitalize",
                borderRadius: "6px",
              },
            },
            grid: {
              line: {
                stroke: "#f3f4f6",
              },
            },
          }}
          tooltipLabel={({ id }) => `${id}`}
          enableLabel={false}
          role="application"
          ariaLabel="A grouped bar chart"
        />
      </CardContent>
    </Card>
  );
}

export function LabelledpieChart({
  className,
  title,
  description,
  data,
  icon,
}: ChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className={`aspect-[4/3] w-full ${className}`}>
        <ResponsivePie
          data={data}
          tooltip={(point: any) => {
            return (
              <div className="flex items-center bg-background rounded px-2 text-sm">
                {icon}
                {visitStatus.find((i) => i.value === point.datum.label)
                  ?.label || point.datum.label}
                :<b className="ml-2">{point.datum.value}</b>
              </div>
            );
          }}
          sortByValue
          margin={{ top: 30, right: 50, bottom: 30, left: 50 }}
          innerRadius={0.5}
          padAngle={1}
          cornerRadius={3}
          activeOuterRadiusOffset={2}
          arcLinkLabelsThickness={1}
          arcLinkLabel={(d: any) =>
            visitStatus.find((i) => i.value === d.id)?.label || d.id
          }
          enableArcLabels={true}
          arcLinkLabelsStraightLength={10}
          arcLinkLabelsDiagonalLength={10}
          colors={randomColorArray}
          theme={{
            tooltip: {
              chip: {
                borderRadius: "9999px",
              },
              container: {
                fontSize: "12px",
                textTransform: "capitalize",
                borderRadius: "6px",
              },
            },
          }}
          role="application"
        />
      </CardContent>
    </Card>
  );
}

export function LineChart({
  className,
  title,
  description,
  data,
  icon,
  xlabel,
  ylabel,
}: ChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className={`aspect-[4/3] w-full${className}`}>
        <ResponsiveLine
          data={[
            {
              id: "Desktop",
              data: data.length > 0 ? data : [{ x: 0, y: 0 }],
            },
          ]}
          tooltip={(point: any) => {
            return (
              <div className="flex items-center bg-background text-foreground px-2 text-sm">
                {icon}
                {point.point?.data.y.toLocaleString()}
              </div>
            );
          }}
          margin={{ top: 50, right: 20, bottom: 50, left: 60 }}
          xScale={{ type: "point" }}
          xFormat=" ^+e"
          yScale={{
            type: "linear",
            min: "auto",
            max: "auto",
            stacked: true,
            reverse: false,
          }}
          gridYValues={5}
          areaBaselineValue={data.reduce(
            (acc: any, cur: any) => (cur.y < acc ? cur.y : acc),
            data[0].y
          )}
          enableArea={true}
          enableGridX={false}
          yFormat=" >-.2f"
          curve="monotoneX"
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: xlabel,
            legendOffset: 36,
            legendPosition: "middle",
            truncateTickAt: 0,
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            legend: ylabel,
            legendOffset: -40,
            legendPosition: "middle",
          }}
          lineWidth={4}
          pointSize={10}
          pointColor={{ theme: "background" }}
          pointBorderWidth={2}
          pointBorderColor={{ from: "serieColor" }}
          pointLabel="data.yFormatted"
          pointLabelYOffset={-12}
          enableTouchCrosshair={true}
          useMesh={true}
          colors={randomColorArray}
        />
      </CardContent>
    </Card>
  );
}

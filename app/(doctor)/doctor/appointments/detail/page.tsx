import { DataTable } from "@/components/myTableComponent/data-table";
import { ArrowRightLeft, MinusCircle, PlusCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { tz, utc } from "moment-timezone";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { redirect } from "next/navigation";
import { appointmentStatus } from "@/components/myTableComponent/data";
import { columns } from "./_appointmentDetailTable/columns";
import TransactionSummury from "./_appointmentDetailTable/transaction-summury";
import { getVisitListById } from "@/helper/visitActoins";

export default async function AppointmentDetailPage(props: any) {
  const { id } = props.searchParams;

  // Fetch data  👇
  const res = await getVisitListById({ id });

  const data = res?.data;

  // Check if data is exist 👇
  if (!data || data?.length === 0) redirect("/doctor/appointments");

  // Function to filter and sort visits based on visit date 👇
  const filterAndSortVisits = (
    data: any[],
    filterCondition: (visit: any) => boolean
  ) => {
    return data.filter(filterCondition).sort((a: any, b: any) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime(); // Descending order
    });
  };

  // Filter and sort visits based on conditions 👇
  const currentVisits = filterAndSortVisits(
    data,
    (visit) =>
      new Date(visit.date).getTime() >
        new Date(
          tz("Asia/Baghdad").format("YYYY-MM-DDTHH:mm:ss.SSS[Z]")
        ).getTime() && visit.status === "checkedIn"
  );

  const decideVisits = filterAndSortVisits(
    data,
    (visit) =>
      new Date(visit.date).getTime() <
        new Date(
          tz("Asia/Baghdad").format("YYYY-MM-DDTHH:mm:ss.SSS[Z]")
        ).getTime() && visit.status === "checkedIn"
  );

  const pastVisits = filterAndSortVisits(
    data,
    (visit) => visit.status !== "checkedIn"
  );

  return (
    <div className="lg:space-y-4 space-y-12">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/doctor/appointments">
              Appointments
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Appointment Details</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="font-bold text-3xl flex items-center gap-2 flex-wrap">
        <h1 className="flex gap-2 items-start">
          <ArrowRightLeft className="w-8 h-8" />
          Details for Appointment ID {id}{" "}
        </h1>
        <Badge>
          {appointmentStatus.map(
            (status) =>
              data[0].Appointment?.status === status.value && status.label
          )}
        </Badge>
      </div>

      {/* Patient Detail 👇 */}
      <Card>
        <CardContent className="mt-4 space-y-4">
          <Label className="text-lg">Patient Detail</Label>
          <div className="grid lg:grid-cols-3 gap-4 ">
            <Label className="space-y-2">
              <span>Full Name</span>
              <Input
                readOnly
                placeholder="Patinet Name"
                value={data[0].Appointment?.Patient?.name}
              />
            </Label>
            <Label className="space-y-2">
              <span>Phone</span>
              <Input
                readOnly
                placeholder="Patinet Phone"
                value={data[0].Appointment?.Patient?.phone}
              />
            </Label>
            <Label className="space-y-2">
              <span>Email</span>
              <Input
                readOnly
                placeholder="Patinet Email"
                value={data[0].Appointment?.Patient?.email}
              />
            </Label>
          </div>
          <div className="grid lg:grid-cols-4  gap-4">
            <Label className="space-y-2">
              <span>Age</span>
              <Input
                readOnly
                placeholder="Patinet Age"
                value={data[0].Appointment?.Patient?.age}
              />
            </Label>
            <Label className="space-y-2">
              <span>Gender</span>
              <Input
                readOnly
                placeholder="Patinet Gender"
                value={
                  data[0].Appointment?.Patient?.gender === "notSelected"
                    ? "Not Selected"
                    : data[0].Appointment?.Patient?.gender
                }
              />
            </Label>
            <Label className="space-y-2">
              <span>City</span>
              <Input
                readOnly
                placeholder="Patinet City"
                value={data[0].Appointment?.Patient?.City?.name}
              />
            </Label>
            <Label className="space-y-2">
              <span>Street</span>
              <Input
                readOnly
                placeholder="Patinet Sreet"
                value={data[0].Appointment?.Patient?.street}
              />
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Doctor Detail 👇 */}
      <Card>
        <CardContent className="mt-4 space-y-4">
          <Label className="text-md ">Doctor Detail</Label>
          <div className="grid lg:grid-cols-3 gap-4 mt-4">
            <div className="flex items-end gap-4">
              <Avatar className="w-14 h-14">
                <AvatarImage src={data[0].Appointment?.Doctor?.image || ""} />
                <AvatarFallback>
                  {data[0].Appointment?.Doctor?.name.charAt(0)}
                </AvatarFallback>
              </Avatar>

              <Label className="space-y-2 w-full">
                <span>Full Name</span>
                <Input
                  readOnly
                  placeholder="Doctor Name"
                  value={data[0].Appointment?.Doctor?.name}
                />
              </Label>
            </div>
            <Label className="space-y-2">
              <span>Phone</span>
              <Input
                readOnly
                placeholder="Doctor Phone"
                value={data[0].Appointment?.Doctor?.phone}
              />
            </Label>
            <Label className="space-y-2">
              <span>Email</span>
              <Input
                readOnly
                placeholder="Doctor Email"
                value={data[0].Appointment?.Doctor?.email}
              />
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Doctor Field and Type 👇 */}
      <Card>
        <CardContent className="mt-4 space-y-4">
          <Label className="text-md ">Doctor Field and Type</Label>
          <div className="grid lg:grid-cols-3 gap-4 mt-1">
            <Label className="space-y-2">
              <span>Doctor Field</span>
              <Input
                readOnly
                placeholder="Doctor Field"
                value={data[0].Appointment?.DoctorType.DoctorField.name}
              />
            </Label>
            <Label className="space-y-2">
              <span>Doctor Type</span>
              <Input
                readOnly
                placeholder="Doctor Type"
                value={data[0].Appointment?.DoctorType?.name}
              />
            </Label>
            <Label className="space-y-2">
              <span>Price</span>
              <Input
                readOnly
                placeholder="Doctor Type"
                value={`$${data[0].Appointment?.DoctorType?.price}`}
              />
            </Label>
          </div>
        </CardContent>
      </Card>
      <Separator />

      <div className="space-y-8">
        <div className="flex justify-between">
          <h1 className="font-bold text-xl flex items-center gap-2">
            <ArrowRightLeft className="w-8 h-8" /> Current
          </h1>
        </div>
        <DataTable data={currentVisits || []} columns={columns} />
      </div>
      <Separator />

      <div className="space-y-8">
        <div className="flex justify-between">
          <h1 className="font-bold text-xl flex items-center gap-2">
            <ArrowRightLeft className="w-8 h-8" /> Decide
          </h1>
        </div>

        <DataTable data={decideVisits || []} columns={columns} />
      </div>
      <Separator />

      <div className="space-y-8">
        <div className="flex justify-between">
          <h1 className="font-bold text-xl flex items-center gap-2">
            <ArrowRightLeft className="w-8 h-8" /> Past Visits
          </h1>
        </div>
        <DataTable data={pastVisits || []} columns={columns} />
      </div>

      {/* Transaction Table 👇 */}
      <Card id="transaction">
        <CardHeader>
          <CardTitle>
            Transaction history for Appointment ID: {data[0].appointmentId}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data[0].Appointment?.Transaction?.length > 0 ? (
                data[0].Appointment.Transaction?.map((transaction: any) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{transaction.id}</TableCell>
                    <TableCell>$ {transaction.amount}</TableCell>
                    <TableCell className="flex items-center gap-1 capitalize">
                      {transaction.type === "payment" ? (
                        <PlusCircle className="text-green-500 w-4 h-4" />
                      ) : (
                        <MinusCircle className="text-red-500 w-4 h-4" />
                      )}
                      {transaction.type}
                    </TableCell>
                    <TableCell>
                      {utc(new Date(transaction.date)).format(
                        "DD/MM/YYYY - hh:mm A"
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <Separator />
          <TransactionSummury appointment={data[0]?.Appointment || {}} />
        </CardContent>
      </Card>
    </div>
  );
}

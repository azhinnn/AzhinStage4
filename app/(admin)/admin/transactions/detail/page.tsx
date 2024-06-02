import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ArrowRightLeft, MinusCircle, PlusCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { utc } from "moment";
import { Badge } from "@/components/ui/badge";
import { redirect } from "next/navigation";
import { appointmentStatus } from "@/components/myTableComponent/data";

const getTransactionByAppId = async ({ id }: any) => {
  try {
    const res = await fetch(
      `${process.env.LOCALHOST}/api/transaction/getByAppId`,
      {
        method: "POST",
        cache: "no-cache",
        body: JSON.stringify({ id }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Check if the response is JSON
    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("Invalid content-type. Expected application/json.");
    }

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();

    return data;
  } catch (error) {
    console.error("Failed to fetch transaction:", error);
    // Handle the error appropriately, e.g., show an error message to the user
    return []; // Return an empty array or a default value as a fallback
  }
};

export default async function Page(props: any) {
  const { id } = props.searchParams;
  const { data } = await getTransactionByAppId({ id });

  if (data.length === 0) redirect("/admin/transactions");

  const serviceCoast = data[0]?.Appointment?.DoctorType?.price;
  const discount = data[0]?.Appointment.Discount?.percentage ?? 0;
  const discountCode = data[0]?.Appointment.Discount?.code;
  const serviceCoastAfterDiscount =
    serviceCoast - (serviceCoast * discount) / 100;
  const totalPaid = data[0]?.Appointment.Transaction?.reduce(
    (a: any, b: any) => a + b.amount,
    0
  );

  const remaining = serviceCoastAfterDiscount - totalPaid;

  return (
    <div className="space-y-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/transactions">
              Transaction
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Transaction Details</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="font-bold text-3xl flex items-center gap-2 flex-wrap">
        <h1 className="flex gap-2 items-start">
          <ArrowRightLeft className="w-8 h-8" />
          Transaction for Appointment ID {data[0]?.Appointment.id}{" "}
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
          <div className="grid lg:grid-cols-3 gap-4">
            <Label className="space-y-2">
              <span>Full Name</span>
              <Input
                readOnly
                placeholder="Patinet Name"
                value={data[0]?.Appointment?.Patient?.name}
              />
            </Label>
            <Label className="space-y-2">
              <span>Phone</span>
              <Input
                readOnly
                placeholder="Patinet Phone"
                value={data[0]?.Appointment?.Patient?.phone}
              />
            </Label>
            <Label className="space-y-2">
              <span>Email</span>
              <Input
                readOnly
                placeholder="Patinet Email"
                value={data[0]?.Appointment?.Patient?.email}
              />
            </Label>
          </div>
          <div className="grid lg:grid-cols-4 gap-4">
            <Label className="space-y-2">
              <span>Age</span>
              <Input
                readOnly
                placeholder="Patinet Age"
                value={data[0]?.Appointment?.Patient?.age}
              />
            </Label>
            <Label className="space-y-2">
              <span>Gender</span>
              <Input
                readOnly
                placeholder="Patinet Gender"
                value={
                  data[0]?.Appointment?.Patient?.gender === "notSelected"
                    ? "Not Selected"
                    : data[0]?.Appointment?.Patient?.gender
                }
              />
            </Label>
            <Label className="space-y-2">
              <span>City</span>
              <Input
                readOnly
                placeholder="Patinet City"
                value={data[0]?.Appointment?.Patient?.city}
              />
            </Label>
            <Label className="space-y-2">
              <span>Street</span>
              <Input
                readOnly
                placeholder="Patinet Sreet"
                value={data[0]?.Appointment?.Patient?.street}
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
                <AvatarImage src={data[0]?.Appointment?.Doctor?.image || ""} />
                <AvatarFallback>
                  {data[0]?.Appointment?.Doctor?.name.charAt(0)}
                </AvatarFallback>
              </Avatar>

              <Label className="space-y-2 w-full">
                <span>Full Name</span>
                <Input
                  readOnly
                  placeholder="Doctor Name"
                  value={data[0]?.Appointment?.Doctor?.name}
                />
              </Label>
            </div>
            <Label className="space-y-2">
              <span>Phone</span>
              <Input
                readOnly
                placeholder="Doctor Phone"
                value={data[0]?.Appointment?.Doctor?.phone}
              />
            </Label>
            <Label className="space-y-2">
              <span>Email</span>
              <Input
                readOnly
                placeholder="Doctor Email"
                value={data[0]?.Appointment?.Doctor?.email}
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
                value={data[0]?.Appointment?.DoctorType.DoctorField.name}
              />
            </Label>
            <Label className="space-y-2">
              <span>Doctor Type</span>
              <Input
                readOnly
                placeholder="Doctor Type"
                value={data[0]?.Appointment?.DoctorType?.name}
              />
            </Label>
            <Label className="space-y-2">
              <span>Doctor Type Coast</span>
              <Input
                readOnly
                placeholder="Doctor Type Coast"
                value={`$${data[0]?.Appointment?.DoctorType?.price}`}
              />
            </Label>
          </div>
        </CardContent>
      </Card>
      <Separator />

      {/* Transaction Table 👇 */}
      <Card>
        <CardHeader>
          <CardTitle>
            Transaction history for Appointment ID: {data[0]?.appointmentId}
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
              {data?.map((transaction: any) => (
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
              ))}
            </TableBody>
          </Table>
          <Separator />
          <div className="font-medium grid grid-cols-2 w-fit gap-x-6 gap-y-3 pt-8">
            <h1>Service Price:</h1>
            <h1>${serviceCoast}</h1>
            <h1>Discount:</h1>
            <h1>
              ${serviceCoastAfterDiscount}{" "}
              <Badge variant={"destructive"}>
                {discountCode} {discount}%
              </Badge>
            </h1>
            <Separator />
            <Separator />
            <h1>Total Paid:</h1>
            {/* sum of ammount of transaction array */}
            <h1>${totalPaid}</h1>

            <h1 className="font-bold">Remaining (Debit) :</h1>
            <h1 className="font-bold">${remaining}</h1>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

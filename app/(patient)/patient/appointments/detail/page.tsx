import {
  FolderPlus,
  Info,
  Microscope,
  MinusCircle,
  Phone,
  PlusCircle,
  Stethoscope,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { utc } from "moment";
import { getUserCookie } from "@/helper/authFunctions";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { visitStatus } from "@/components/myTableComponent/data";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import ImageButton from "./_component/image-button";

export default async function Page(props: any) {
  const appid = props.searchParams.appid;
  const { id } = (await getUserCookie()) as any;

  const app = await db.appointment.findFirst({
    where: {
      id: Number(appid),
      patientId: Number(id),
    },
    include: {
      Doctor: true,
      DoctorType: {
        include: {
          DoctorField: true,
        },
      },
      Visit: true,
      Transaction: true,
      Discount: true,
    },
  });

  if (!app) {
    redirect("/patient/appointments");
  }

  const serviceCoast = app.DoctorType?.price || 0;
  const afterDiscount =
    serviceCoast * (1 - (app.Discount?.percentage || 0) / 100);

  const totalPaid = app.Transaction?.map((t) => t.amount).reduce(
    (a, b) => a + b,
    0
  );

  const remaining = afterDiscount - totalPaid;

  return (
    <div className="space-y-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/patient/appointments">
              Appointments
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Appointment Details</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <h1 className="font-bold text-3xl flex items-start gap-2">
        <Info className="w-8 h-8 drop-shadow-md" /> Appointment Details
      </h1>

      {/* Doctor Details 👇 */}
      <Card className="drop-shadow-md min-w-max">
        <CardHeader>
          <CardDescription className="flex gap-2 items-center">
            <Stethoscope className="w-4 h-4" />
            Doctor Details
          </CardDescription>
          <CardTitle className="flex items-center gap-3">
            <Avatar>
              <AvatarImage
                src={app.Doctor?.image || ""}
                className="object-cover"
              />
              <AvatarFallback>{app.Doctor?.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="font-bold">{app.Doctor?.name}</div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p className=" flex items-center gap-2">
            <Phone className="w-4 h-4" />
            {app.Doctor?.phone.replace(/(\d{4})(\d{3})(\d{4})/, "$1 $2 $3")}
          </p>
          <p className=" flex items-center gap-2">
            <FolderPlus className="w-4 h-4" />
            {app.DoctorType?.DoctorField?.name}
          </p>
          <p className=" flex items-center gap-2">
            <Microscope className="w-4 h-4" />
            {app.DoctorType?.name}
          </p>
        </CardContent>
      </Card>

      {/* Visit Table Details 👇 */}
      <Card className="pb-4">
        <CardHeader>
          <CardTitle>Visits</CardTitle>
          <CardDescription>List of your visits.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>A list of your visits.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Visit Date</TableHead>
                <TableHead>Note</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Image</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {app.Visit?.map((visit, index) => (
                <TableRow key={visit.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    {utc(visit.date).format("DD/MM/YYYY - hh:mm A")}
                  </TableCell>
                  <TableCell>
                    {visit.note || (
                      <span className="text-muted-foreground">No Note</span>
                    )}
                  </TableCell>
                  <TableCell className="flex gap-1 items-center">
                    {(() => {
                      const status = visitStatus.find(
                        (status) => status.value === visit.status
                      );
                      return (
                        <>
                          {status && <status.icon className="w-4 h-4" />}
                          {status?.label}
                        </>
                      );
                    })()}
                  </TableCell>
                  <TableCell>
                    <ImageButton id={visit.id} imageUrl={visit.image} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Transaction Table Details 👇 */}
      <Card className="pb-4">
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
          <CardDescription>List of all your transactions.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>A list of your transaction.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {app.Transaction?.map((transaction, index) => (
                <TableRow key={transaction.id}>
                  <TableCell>{index + 1}</TableCell>
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
                    {utc(transaction.date).format("DD/MM/YYYY - hh:mm A")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Transaction Summury</CardTitle>
          <CardDescription>Summury of all your transactions.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-2 md:text-lg">
          <h3>Service Coast</h3>
          <h3>${serviceCoast}</h3>
          <h3>Discount</h3>
          <h3 className="flex items-center gap-2">
            ${afterDiscount}{" "}
            <Badge variant={"destructive"}>
              {app.Discount?.code} {app.Discount?.percentage || 0}%{" "}
            </Badge>
          </h3>
          <Separator />
          <Separator />
          <h3>Total Paid</h3>
          <h3>${totalPaid}</h3>
          <h3 className="font-bold">Remaining</h3>
          <h3 className="font-bold">${remaining}</h3>
        </CardContent>
      </Card>
    </div>
  );
}

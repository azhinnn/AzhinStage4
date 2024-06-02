import { getUserCookie } from "@/helper/authFunctions";
import { db } from "@/lib/db";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  BadgeAlert,
  DollarSign,
  FolderPlus,
  HandCoins,
  Microscope,
  Stethoscope,
  TicketPercent,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default async function Page() {
  const { id } = (await getUserCookie()) as any;
  const appointments = await db.appointment.findMany({
    where: {
      patientId: Number(id),
      Visit: {
        some: {
          status: "completed",
        },
      },
    },
    select: {
      id: true,
      status: true,
      Doctor: {
        select: {
          name: true,
          image: true,
        },
      },
      DoctorType: {
        select: {
          name: true,
          price: true,
          DoctorField: {
            select: {
              name: true,
            },
          },
        },
      },
      Visit: {
        select: {
          status: true,
        },
      },
      Discount: {
        select: {
          percentage: true,
          code: true,
        },
      },
      Transaction: {
        select: {
          amount: true,
        },
      },
    },
  });

  // filter those appointments which the total amount of transaction including discount is less than the doctor type price 👇
  const data = appointments.filter((item) => {
    const totalTransactionAmount = item.Transaction.reduce(
      (sum, transaction) => sum + transaction.amount,
      0
    );
    const doctorTypePrice = item.DoctorType.price;
    const discountAmount = item.Discount
      ? (doctorTypePrice * item.Discount.percentage) / 100
      : 0;
    const totalPriceWithDiscount = doctorTypePrice - discountAmount;

    return totalTransactionAmount < totalPriceWithDiscount;
  });

  return (
    <div className="space-y-4">
      <h1 className="font-bold text-3xl flex items-start gap-2">
        <HandCoins className="w-8 h-8 drop-shadow-md" /> Debts
      </h1>
      <div className="grid gap-4 xl:grid-cols-2 md:gap-8">
        {data.length > 0 ? (
          data.map((transaction) => (
            <DebtCards key={transaction.id} transaction={transaction} />
          ))
        ) : (
          <Card className="text-center text-muted-foreground col-span-2">
            <CardHeader>
              <CardTitle>No Debt</CardTitle>
            </CardHeader>
            <CardContent>
              <p>No Debts yet</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

// debt card template 👇
function DebtCards({ transaction }: { transaction: any }) {
  const serviceCoast = transaction?.DoctorType?.price;
  const discount = transaction?.Discount?.percentage || 0;
  const discountCode = transaction?.Discount?.code || null;
  const serviceCoastAfterDiscount =
    serviceCoast - (serviceCoast * discount) / 100;
  const totalPaid = transaction?.Transaction?.reduce(
    (a: any, b: any) => a + b.amount,
    0
  );
  const remaining = serviceCoastAfterDiscount - totalPaid;

  return (
    <Link href={`/patient/appointments/detail?appid=${transaction?.id}`}>
      <Card className="hover:bg-card/80 transition-colors">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Avatar>
              <AvatarImage
                src={transaction?.Doctor.image || ""}
                className="object-cover"
              />
              <AvatarFallback>
                {transaction?.Doctor.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <span className="flex justify-between w-full items-center">
              {transaction?.Doctor.name}{" "}
              <p className="text-sm font-light ml-auto">
                <Stethoscope className="h-4 w-4" />
              </p>
            </span>
          </CardTitle>
          <CardDescription className="flex items-center gap-4 pt-3">
            <span className="flex items-center gap-2">
              <FolderPlus className="h-4 w-4" />{" "}
              {transaction?.DoctorType.DoctorField.name}
            </span>{" "}
            -
            <span className="flex items-center gap-2">
              <Microscope className="h-4 w-4" /> {transaction?.DoctorType.name}
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Label className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" /> Price: ${serviceCoast}
          </Label>
          <Label className="flex items-center gap-2">
            <TicketPercent className="h-4 w-4" /> Discount: $
            {serviceCoastAfterDiscount}{" "}
            <Badge variant={"destructive"} className="min-w-fit">
              {discountCode} {discount}%
            </Badge>
          </Label>
          <Separator />
          <Label className="flex items-center gap-2">
            <HandCoins className="h-4 w-4" /> Paid: ${totalPaid}
          </Label>
          <Label className="flex items-center text-destructive gap-2">
            <BadgeAlert className="h-4 w-4" /> Remaining: ${remaining}
          </Label>
        </CardContent>
      </Card>
    </Link>
  );
}

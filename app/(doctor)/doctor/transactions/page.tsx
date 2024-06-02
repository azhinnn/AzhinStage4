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
  CalendarClock,
  DollarSign,
  FolderPlus,
  HandCoins,
  HeartPulse,
  Microscope,
  MinusCircle,
  PlusCircle,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { utc } from "moment-timezone";
import Link from "next/link";

export default async function Page() {
  const { id } = (await getUserCookie()) as any;

  const data = await db.transaction.findMany({
    where: {
      Appointment: {
        doctorId: Number(id),
      },
    },
    select: {
      amount: true,
      date: true,
      type: true,
      Appointment: {
        select: {
          id: true,
          Doctor: {
            select: {
              name: true,
              image: true,
            },
          },
          DoctorType: {
            select: {
              name: true,
              DoctorField: {
                select: {
                  name: true,
                },
              },
            },
          },
          Patient: {
            select: {
              name: true,
              phone: true,
            },
          },
        },
      },
    },
  });

  return (
    <div className="space-y-4">
      <h1 className="font-bold text-3xl flex items-center gap-2">
        <DollarSign className="w-6 h-6" /> Transactions
      </h1>
      <div className="grid gap-4">
        {data.length > 0 ? (
          data?.map((transaction, index) => (
            <Link
              key={index}
              href={`/doctor/appointments/detail?id=${transaction?.Appointment.id}`}>
              <Card className="hover:bg-card/80 transition-colors">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={""} className="object-cover" />
                      <AvatarFallback>
                        {transaction?.Appointment.Patient.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex justify-between w-full items-center">
                      <div className="space-y-1">
                        <h1>{transaction?.Appointment.Patient.name}</h1>
                        <p className="text-sm font-light ml-auto">
                          {transaction?.Appointment?.Patient?.phone.replace(
                            /(\d{4})(\d{3})(\d{4})/,
                            "$1 $2 $3"
                          )}
                        </p>
                      </div>
                      <HeartPulse className="h-4 w-4" />
                    </div>
                  </CardTitle>
                  <CardDescription className="flex items-center gap-4 pt-3">
                    <span className="flex items-center gap-2">
                      <FolderPlus className="h-4 w-4" />
                      {transaction?.Appointment.DoctorType.DoctorField.name}
                    </span>
                    -
                    <span className="flex items-center gap-2">
                      <Microscope className="h-4 w-4" />
                      {transaction?.Appointment.DoctorType.name}
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Label className="flex items-center gap-2 text-muted-foreground">
                    <HandCoins className="h-4 w-4" />{" "}
                    {transaction?.type === "payment" ? (
                      <PlusCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <MinusCircle className="h-4 w-4 text-red-500" />
                    )}
                    ${transaction?.amount}
                  </Label>
                  <Label className="flex items-center gap-2 text-muted-foreground">
                    <CalendarClock className="h-4 w-4" />
                    {utc(transaction?.date).format("DD/MM/YYYY - hh:mm A")}
                  </Label>
                </CardContent>
              </Card>
            </Link>
          ))
        ) : (
          <Card className="text-center text-muted-foreground">
            <CardHeader>
              <CardTitle>No Transaction</CardTitle>
            </CardHeader>
            <CardContent>
              <p>No transaction yet</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db } from "@/lib/db";
import { DollarSign, MinusCircle, PlusCircle } from "lucide-react";
import { utc } from "moment";

export default async function TransactionTable() {
  const data = await db.transaction.findMany({
    select: {
      id: true,
      date: true,
      type: true,
      amount: true,
      Appointment: {
        select: {
          id: true,
          Patient: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
    take: 5,
    orderBy: {
      date: "desc",
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <h1 className="font-semibold text-lg md:text-xl flex items-center gap-2">
          <DollarSign className="w-6 h-6" />
          Recent Transactions
        </h1>
      </div>
      <div className="border rounded-md">
        <Table>
          <TableCaption className="my-4">
            A list of your recent transactions.
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Patient</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{transaction.id}</TableCell>
                <TableCell>{transaction.Appointment.Patient.name}</TableCell>
                <TableCell>${transaction.amount}</TableCell>
                <TableCell className="flex items-center gap-1 capitalize">
                  {transaction.type === "payment" ? (
                    <PlusCircle className="text-green-500 w-4 h-4" />
                  ) : (
                    <MinusCircle className="text-red-500 w-4 h-4" />
                  )}
                  {transaction.type}
                </TableCell>
                <TableCell>
                  {utc(new Date(transaction.date)).format("DD/MM/YYYY")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

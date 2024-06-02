import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    // find those appointments which the total amount of transaction including discount is less than the doctor type price
    const appointments = await db.appointment.findMany({
      where: {
        Visit: {
          some: {
            status: "completed",
          },
        },
      },
      select: {
        id: true,
        date: true,

        Transaction: true,
        DoctorType: {
          include: {
            DoctorField: true,
          },
        },
        Discount: true,
        Patient: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
        Doctor: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

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

    return NextResponse.json({ data, status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message, status: 500 });
  }
}

import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { id, status } = await req.json();

    const transactions = await db.appointment.findFirst({
      where: {
        Visit: {
          some: {
            id: Number(id),
          },
        },
      },
      select: {
        id: true,
        Transaction: {
          select: {
            id: true,
            amount: true,
          },
        },
        DoctorType: {
          select: {
            price: true,
          },
        },
      },
    });

    const discount = await db.discount.findFirst({
      where: {
        Appointment: {
          some: {
            id: Number(transactions?.id),
          },
        },
      },
      select: {
        id: true,
        percentage: true,
      },
    });

    const totalPaid = transactions?.Transaction.reduce(
      (total, transaction) => total + transaction.amount,
      0
    );

    const afterDiscount =
      (transactions?.DoctorType.price || 0) *
      (1 - (discount?.percentage || 0) / 100);

    if (afterDiscount !== totalPaid && status === "cancelled") {
      return NextResponse.json({
        error: "Patient not completed the payment",
        status: 400,
      });
    }

    if (afterDiscount === totalPaid && status === "completed") {
      try {
        await db.appointment.update({
          where: {
            id: transactions?.id,
          },
          data: {
            status: "completed",
          },
        });
      } catch (error) {}
    }

    const data = await db.visit.update({
      where: {
        id: Number(id),
      },
      data: {
        status,
      },
    });

    return NextResponse.json({ data, status: 200 });
  } catch (error) {
    return NextResponse.json({ error, status: 500 });
  }
}

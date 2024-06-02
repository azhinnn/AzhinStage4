import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { appointmentId, amount, type } = await req.json();

    const transactions = await db.appointment.findUnique({
      where: {
        id: Number(appointmentId),
      },
      select: {
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
            id: Number(appointmentId),
          },
        },
      },
      select: {
        id: true,
        percentage: true,
      },
    });

    const totalPaid = Number(
      transactions?.Transaction.reduce(
        (total, transaction) => total + transaction.amount,
        0
      )?.toLocaleString()
    );

    const afterDiscount =
      (transactions?.DoctorType.price || 0) *
      (1 - (discount?.percentage || 0) / 100);

    if (afterDiscount < (totalPaid || 0) + Number(amount)) {
      return NextResponse.json({
        error: "Amount exceeds the maximum allowed amount",
        status: 409,
      });
    }

    if (afterDiscount === (totalPaid || 0) + Number(amount)) {
      try {
        await db.appointment.update({
          where: {
            id: Number(appointmentId),
            Visit: {
              some: {
                status: "completed",
              },
            },
          },
          data: {
            status: "completed",
          },
        });
      } catch (error) {}
    }

    const data = await db.transaction.create({
      data: {
        amount: Math.floor(Number(amount) * 100) / 100,
        type,
        Appointment: {
          connect: {
            id: Number(appointmentId),
          },
        },
        date: new Date(),
      },
    });

    return NextResponse.json({ data, status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message, status: 500 });
  }
}

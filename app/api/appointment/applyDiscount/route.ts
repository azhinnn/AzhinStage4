import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { code, appointmentId, doctorId, doctorTypeId } = await req.json();

    const checkCompletedAppointment = await db.appointment.findFirst({
      where: {
        id: Number(appointmentId),
        status: "completed",
      },
    });

    if (checkCompletedAppointment) {
      return NextResponse.json({
        error: "Appointment already completed",
        status: 409,
        errorType: "completed",
      });
    }

    // check if dicount code exists for this doctor and type 👇
    const checkDiscountCode = await db.discount.findFirst({
      where: {
        code,
        doctorId: Number(doctorId),
        doctortypeId: Number(doctorTypeId),
      },
      select: {
        id: true,
        startDate: true,
        endDate: true,
      },
    });

    if (!checkDiscountCode) {
      return NextResponse.json({ error: "Code not found", status: 404 });
    }

    // check if the discount code is expired
    const checkDate = await db.discount.findFirst({
      where: {
        code,
        startDate: {
          lte: new Date(checkDiscountCode.startDate),
        },
        endDate: {
          gte: new Date(checkDiscountCode.endDate),
        },
      },
      select: {
        id: true,
        percentage: true,
      },
    });

    if (!checkDate) {
      return NextResponse.json({
        error: "Code expired",
        status: 409,
        errorType: "expired",
      });
    }

    // check if the discount code is already applied to this appointment
    const checkDiscountCodeApplied = await db.discount.findFirst({
      where: {
        code,
        Appointment: {
          some: {
            id: Number(appointmentId),
          },
        },
      },
      select: {
        id: true,
      },
    });

    if (checkDiscountCodeApplied) {
      return NextResponse.json({
        error: "Code already applied",
        status: 409,
        errorType: "applied",
      });
    }

    const data = await db.appointment.update({
      where: {
        id: Number(appointmentId),
      },
      data: {
        Discount: {
          connect: {
            id: checkDiscountCode.id,
          },
        },
      },
      include: {
        Discount: {
          select: {
            percentage: true,
          },
        },
      },
    });

    return NextResponse.json({ data, status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message, status: 500 });
  }
}

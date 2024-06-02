import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  try {
    const id = await req.json();

    const checkAppointment = await db.appointment.findFirst({
      where: {
        doctorId: Number(id),
        status: {
          not: "completed",
        },
      },
    });

    if (checkAppointment) {
      return NextResponse.json({
        error: "doctor has appointment",
        status: 204,
      });
    }

    await db.discount.deleteMany({
      where: {
        doctorId: Number(id),
      },
    });

    const data = await db.doctor.delete({
      where: {
        id: Number(id),
      },
    });

    return NextResponse.json({ data, status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message, status: 500 });
  }
}

import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { appointmentId, nextVisitDate } = await req.json();

    const checkAppointmentStatus = await db.appointment.findFirst({
      where: {
        id: Number(appointmentId),
        status: "completed",
      },
    });

    if (checkAppointmentStatus) {
      return NextResponse.json({ error: "Appointment is done", status: 409 });
    }

    const data = await db.visit.create({
      data: {
        date: nextVisitDate + ":00.000Z",
        Appointment: {
          connect: {
            id: Number(appointmentId),
          },
        },
      },
    });
    return NextResponse.json({ data, status: 200 });
  } catch (error) {
    return NextResponse.json({ error, status: 500 });
  }
}

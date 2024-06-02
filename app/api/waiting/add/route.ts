import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { tz } from "moment-timezone";

export async function POST(req: NextRequest) {
  try {
    const { patientId, doctorId, doctorFieldId, doctorTypeId } =
      await req.json();

    const checkWaiting = await db.waiting.findFirst({
      where: {
        patientId: Number(patientId),
        doctorId: Number(doctorId),
        doctorFieldId: Number(doctorFieldId),
        doctorTypeId: Number(doctorTypeId),
        status: "pending",
      },
    });

    if (checkWaiting) {
      return NextResponse.json({
        error: "Request Already exists",
        status: 409,
        errorType: "requestAlreadyExists",
      });
    }

    const checkAppointment = await db.appointment.findFirst({
      where: {
        doctorId: Number(doctorId),
        patientId: Number(patientId),
        doctorTypeId: Number(doctorTypeId),
        status: {
          notIn: ["cancelled", "completed"],
        },
      },
    });

    if (checkAppointment) {
      return NextResponse.json({
        error: "Appointment Already exists",
        status: 409,
        errorType: "appointmentAlreadyExists",
      });
    }

    const data = await db.waiting.create({
      data: {
        patientId: Number(patientId),
        doctorId: Number(doctorId),
        doctorFieldId: Number(doctorFieldId),
        doctorTypeId: Number(doctorTypeId),
        status: "pending",
        createdAt: new Date(
          tz("Asia/Baghdad").format("YYYY-MM-DDTHH:mm:ss.SSS[Z]")
        ),
      },
    });

    return NextResponse.json({ data, status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message, status: 500 });
  }
}

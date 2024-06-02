import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { id, status } = await req.json();

    const updated = await db.waiting.update({
      where: {
        id: Number(id),
      },
      data: {
        status,
      },
    });

    if (status === "accepted") {
      const data = await db.appointment.create({
        data: {
          date: new Date(),
          Doctor: {
            connect: {
              id: Number(updated.doctorId),
            },
          },
          DoctorType: {
            connect: {
              id: Number(updated.doctorTypeId),
            },
          },
          Patient: {
            connect: {
              id: Number(updated.patientId),
            },
          },
        },
      });

      return NextResponse.json({
        data,
        status: 200,
        message: "updated and created appointment",
      });
    }

    return NextResponse.json({
      status: 200,
      message: "updated",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message, status: 500 });
  }
}

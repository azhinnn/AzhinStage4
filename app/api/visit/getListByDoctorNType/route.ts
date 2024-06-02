import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { doctorId, doctorTypeId } = await req.json();

    const data = await db.visit.findMany({
      where: {
        status: "checkedIn",
        Appointment: {
          doctorId: Number(doctorId),
          doctorTypeId: Number(doctorTypeId),
        },
      },
      select: {
        id: true,
        date: true,
        Appointment: {
          select: {
            Patient: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ data, status: 200 });
  } catch (error) {
    return NextResponse.json({ error, status: 500 });
  }
}

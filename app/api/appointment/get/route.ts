import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const data = await db.appointment.findMany({
      include: {
        Doctor: true,
        Patient: true,
        DoctorType: {
          include: {
            DoctorField: true,
          },
        },
        Visit: true,
      },
    });

    return NextResponse.json({ data, status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message, status: 500 });
  }
}

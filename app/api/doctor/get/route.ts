import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const data = await db.doctor.findMany({
      include: {
        DoctorField: true,
        DoctorType: true,
        City: true,
      },
    });

    return NextResponse.json({ data, status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message, status: 500 });
  }
}

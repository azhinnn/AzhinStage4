import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const data = await db.doctortype.findMany({
      include: {
        Doctor: {
          select: {
            id: true,
            name: true,
          },
        },
        DoctorField: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json({ data, status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message, status: 500 });
  }
}

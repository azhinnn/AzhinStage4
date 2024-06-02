import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { id } = await req.json();

    const data = await db.doctor.findFirst({
      include: {
        DoctorField: true,
        DoctorType: true,
        City: true,
      },
      where: {
        id: Number(id),
      },
    });

    return NextResponse.json({ data, status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message, status: 500 });
  }
}

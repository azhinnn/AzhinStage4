import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { id } = await req.json();

    const data = await db.appointment.findFirst({
      where: {
        id: Number(id),
      },
      include: {
        Doctor: true,
        Patient: {
          include: {
            City: true,
          },
        },
        DoctorType: {
          include: {
            DoctorField: true,
          },
        },
        Visit: true,
        Transaction: true,
        Discount: true,
      },
    });

    if (!data)
      return NextResponse.json({ error: "Appointment not found", status: 404 });

    return NextResponse.json({ data, status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message, status: 500 });
  }
}

import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { appointmentId } = await req.json();

    const data = await db.visit.findMany({
      where: {
        appointmentId: Number(appointmentId),
      },
      include: {
        Appointment: {
          include: {
            Patient: {
              include: {
                City: true,
              },
            },
            Doctor: true,
            DoctorType: {
              include: {
                DoctorField: true,
              },
            },
            Discount: true,
            Transaction: true,
          },
        },
      },
    });

    return NextResponse.json({ data, status: 200 });
  } catch (error) {
    return NextResponse.json({ error, status: 500 });
  }
}

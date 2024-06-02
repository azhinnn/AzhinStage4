import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const data = await db.discount.findMany({
      include: {
        Appointment: {
          select: {
            id: true,
          },
        },
        Doctor: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        Doctortype: {
          select: {
            id: true,
            name: true,
            price: true,
          },
        },
      },
    });

    return NextResponse.json({ data, status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message, status: 500 });
  }
}

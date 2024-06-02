import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const data = await db.transaction.findMany({
      include: {
        Appointment: {
          select: {
            id: true,
            date: true,
            Doctor: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
            Patient: {
              select: {
                id: true,
                name: true,
                phone: true,
              },
            },
            DoctorType: {
              select: {
                id: true,
                name: true,
                price: true,
                DoctorField: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    });

    return NextResponse.json({ data, status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message, status: 500 });
  }
}

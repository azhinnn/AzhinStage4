import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const data = await db.visit.findMany({
      include: {
        Appointment: {
          include: {
            Doctor: {
              select: {
                id: true,
                name: true,
                image: true,
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
            Patient: {
              select: {
                id: true,
                name: true,
                phone: true,
                email: true,
              },
            },
            Transaction: {
              select: {
                id: true,
                amount: true,
              },
            },
            Discount: {
              select: {
                id: true,
                code: true,
                percentage: true,
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

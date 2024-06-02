import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { id } = await req.json();

    const data = await db.transaction.findMany({
      where: {
        appointmentId: Number(id),
      },
      include: {
        Appointment: {
          select: {
            id: true,
            date: true,
            status: true,
            Doctor: {
              select: {
                id: true,
                name: true,
                image: true,
                phone: true,
                email: true,
              },
            },
            Patient: {
              select: {
                id: true,
                name: true,
                phone: true,
                email: true,
                age: true,
                gender: true,
                City: true,
                street: true,
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
            Discount: {
              select: {
                id: true,
                name: true,
                code: true,
                percentage: true,
              },
            },
            Transaction: {
              select: {
                id: true,
                amount: true,
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

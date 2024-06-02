import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const data = await db.waiting.findMany({
      include: {
        Patient: {
          select: {
            id: true,
            name: true,
            image: true,
            phone: true,
          },
        },
        Doctor: {
          select: {
            id: true,
            name: true,
            image: true,
            phone: true,
          },
        },
        DoctorField: {
          select: {
            id: true,
            name: true,
          },
        },
        DoctorType: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json({ data, status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message, status: 500 });
  }
}

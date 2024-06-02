import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();

    const checkDoctor = await db.doctortype.findFirst({
      where: {
        id: Number(id),
      },
      select: {
        _count: {
          select: {
            Doctor: true,
          },
        },
      },
    });

    if (checkDoctor?._count.Doctor) {
      return NextResponse.json({
        error: "Doctor type has doctor",
        status: 409,
      });
    }

    const data = await db.doctortype.delete({
      where: {
        id: Number(id),
      },
    });

    return NextResponse.json({ data, status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message, status: 500 });
  }
}

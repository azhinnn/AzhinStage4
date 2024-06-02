import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { id, name, price, doctorFieldId } = await req.json();

    const checkName = await db.doctortype.findFirst({
      where: {
        id: {
          not: Number(id),
        },
        name: {
          equals: name,
        },
        doctorFieldId: {
          equals: Number(doctorFieldId),
        },
      },
    });

    if (checkName) {
      return NextResponse.json({ error: "Name already exists", status: 409 });
    }

    const data = await db.doctortype.update({
      where: {
        id: Number(id),
      },
      data: {
        name,
        price: Number(price),
        DoctorField: {
          connect: {
            id: Number(doctorFieldId),
          },
        },
      },
    });

    return NextResponse.json({ data, status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message, status: 500 });
  }
}

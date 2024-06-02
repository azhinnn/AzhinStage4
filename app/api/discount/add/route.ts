import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const {
      name,
      code,
      percentage,
      startDate,
      endDate,
      doctorId,
      doctorTypeId,
    } = await req.json();

    const checkNameOrCode = await db.discount.findFirst({
      where: {
        OR: [
          {
            name: {
              equals: name,
            },
          },
          {
            code: {
              equals: code,
            },
          },
        ],
      },
    });

    if (checkNameOrCode) {
      return NextResponse.json({ error: "Name already exists", status: 409 });
    }

    const data = await db.discount.create({
      data: {
        name,
        code,
        percentage: parseFloat(percentage),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        Doctor: {
          connect: {
            id: Number(doctorId),
          },
        },
        Doctortype: {
          connect: {
            id: Number(doctorTypeId),
          },
        },
      },
    });

    return NextResponse.json({ data, status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message, status: 500 });
  }
}

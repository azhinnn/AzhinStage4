import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { id, name } = await req.json();

    const checkName = await db.city.findFirst({
      where: {
        id: {
          not: Number(id),
        },
        name: {
          equals: name,
        },
      },
    });

    if (checkName) {
      return NextResponse.json({ error: "Name already exists", status: 409 });
    }

    const data = await db.city.update({
      where: {
        id: Number(id),
      },
      data: {
        name,
      },
    });

    return NextResponse.json({ data, status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message, status: 500 });
  }
}

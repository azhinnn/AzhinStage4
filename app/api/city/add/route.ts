import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { name } = await req.json();

    const checkCityName = await db.city.findFirst({
      where: {
        name: {
          equals: name,
        },
      },
    });

    if (checkCityName) {
      return NextResponse.json({ error: "Name already exists", status: 409 });
    }

    const data = await db.city.create({
      data: {
        name,
      },
    });

    return NextResponse.json({ data, status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message, status: 500 });
  }
}

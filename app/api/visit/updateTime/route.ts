import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { id, newTime } = await req.json();

    const data = await db.visit.update({
      where: {
        id: Number(id),
      },
      data: {
        date: new Date(newTime),
      },
    });

    return NextResponse.json({ data, status: 200 });
  } catch (error) {
    return NextResponse.json({ error, status: 500 });
  }
}

import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const data = await db.waiting.deleteMany({});

    return NextResponse.json({ status: 200, data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message, status: 500 });
  }
}

import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const data = await db.transaction.findMany({});

    return NextResponse.json({ data, status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message, status: 500 });
  }
}

import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST() {
  try {
    const data = await db.admin.findMany({});

    return NextResponse.json({ data, status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message, status: 500 });
  }
}

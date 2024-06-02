import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { search } = await req.json();

    const data = await db.patient.findMany({
      where: {
        OR: [
          {
            name: {
              contains: search,
            },
          },
          {
            email: {
              contains: search,
            },
          },
          {
            phone: {
              contains: search.includes(" ")
                ? search.split(" ").join("")
                : search,
            },
          },
        ],
      },
      include: {
        City: true,
      },
    });

    return NextResponse.json({ data, status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message, status: 500 });
  }
}

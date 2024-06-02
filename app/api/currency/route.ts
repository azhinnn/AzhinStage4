import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await db.currency.findFirst();
    if (!data) {
      return NextResponse.json({ data: null, status: 404 });
    }
    return NextResponse.json({ data, status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message, status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { price } = await req.json();
    const findFirstData = await db.currency.findFirst();
    let data = {};

    if (findFirstData) {
      data = await db.currency.update({
        where: {
          id: findFirstData?.id,
        },
        data: {
          price: Number(price),
        },
      });
    } else {
      data = await db.currency.create({
        data: {
          price: Number(price),
        },
      });
    }

    return NextResponse.json({
      data,
      message: "Price updated successfully",
      status: 200,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message, status: 500 });
  }
}

import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();

    const checkApplied = await db.appointment.findFirst({
      where: {
        discountId: id,
      },
    });

    if (checkApplied) {
      return NextResponse.json({
        error: "Discount applied appointment",
        status: 409,
      });
    }

    const data = await db.discount.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({ data, status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message, status: 500 });
  }
}

import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();

    const checkCityOnAppointment = await db.patient.findFirst({
      where: {
        City: {
          id: Number(id),
        },
      },
    });

    if (checkCityOnAppointment) {
      return NextResponse.json({ error: "City is in use", status: 409 });
    }

    const data = await db.city.delete({
      where: {
        id: Number(id),
      },
    });

    return NextResponse.json({ data, status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message, status: 500 });
  }
}

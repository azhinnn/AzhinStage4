import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();

    // delete Visits related to this Appointment
    await db.visit.deleteMany({
      where: {
        appointmentId: Number(id),
      },
    });

    // delete Transactions related to this Appointment
    await db.transaction.deleteMany({
      where: {
        appointmentId: Number(id),
      },
    });

    const data = await db.appointment.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json({
      data,
      status: 200,
      message: "Appointment deleted",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message, status: 500 });
  }
}

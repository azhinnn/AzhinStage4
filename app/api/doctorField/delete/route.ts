import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();

    const checkDoctor = await db.doctor.findFirst({
      where: {
        doctorFieldId: Number(id),
      },
    });

    if (checkDoctor) {
      return NextResponse.json({
        error: "Field is in use",
        status: 409,
      });
    }

    const checkDoctorType = await db.doctortype.findFirst({
      where: {
        doctorFieldId: Number(id),
      },
    });

    if (checkDoctorType) {
      return NextResponse.json({
        error: "Field is in use",
        status: 409,
      });
    }

    const data = await db.doctorfield.delete({
      where: {
        id: Number(id),
      },
    });

    return NextResponse.json({ data, status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message, status: 500 });
  }
}

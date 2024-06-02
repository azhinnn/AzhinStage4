import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { id, name, phone, email, image, age, city, street, gender, note } =
      await req.json();

    const checkEmail = await db.patient.findFirst({
      where: {
        OR: [{ email }, { phone }],
        NOT: { id: Number(id) },
      },
    });

    if (checkEmail && checkEmail.id !== Number(id)) {
      return NextResponse.json({
        error: "Email or Phone already exists",
        status: 409,
      });
    }

    const data = await db.patient.update({
      where: {
        id: Number(id),
      },
      data: {
        name,
        phone,
        email,
        image,
        age: Number(age),
        City: {
          connect: {
            id: Number(city),
          },
        },
        street,
        gender,
        note,
      },
    });

    return NextResponse.json({ data, status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message, status: 500 });
  }
}

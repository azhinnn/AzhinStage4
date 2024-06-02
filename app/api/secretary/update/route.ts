import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { id, name, email, phone, gender } = await req.json();

    const checkPhoneNEmail = await db.secretary.findFirst({
      where: {
        id: {
          not: Number(id),
        },
        OR: [
          {
            phone: {
              contains: phone,
            },
          },
          {
            email: {
              contains: email,
            },
          },
        ],
      },
    });

    if (checkPhoneNEmail && checkPhoneNEmail.id !== Number(id)) {
      return NextResponse.json({
        error: "Phone number or email already exists",
        status: 409,
      });
    }

    const data = await db.secretary.update({
      where: {
        id: Number(id),
      },
      data: {
        name,
        email,
        phone,
        gender,
      },
    });

    return NextResponse.json({ data, status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message, status: 500 });
  }
}

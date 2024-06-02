import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { id, name, email, phone } = await req.json();

    const checkEmailNPhone = await db.admin.findFirst({
      where: {
        id: {
          not: Number(id),
        },
        OR: [
          {
            email: {
              contains: email,
            },
          },
          {
            phone: {
              contains: phone,
            },
          },
        ],
      },
    });

    if (checkEmailNPhone && checkEmailNPhone.id !== Number(id)) {
      return NextResponse.json({
        error: "Phone number or email already exists",
        status: 409,
      });
    }

    const data = await db.admin.update({
      where: {
        id: Number(id),
      },
      data: {
        name,
        email,
        phone,
      },
    });

    return NextResponse.json({ data, status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message, status: 500 });
  }
}

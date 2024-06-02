import { hashPassword } from "@/helper/authFunctions";
import { db } from "@/lib/db";
import { compare } from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { id, password, currentPassword } = await req.json();

    if (currentPassword) {
      const checkCurrentPassword = await db.admin.findUnique({
        where: {
          id,
        },
        select: {
          hashedPassword: true,
        },
      });

      const isPasswordValid =
        checkCurrentPassword &&
        (await compare(currentPassword, checkCurrentPassword.hashedPassword));

      if (!isPasswordValid) {
        return NextResponse.json({
          error: "Current password is incorrect",
          status: 401,
        });
      }
    }

    const hashedPassword = await hashPassword(password);

    await db.admin.update({
      where: {
        id,
      },
      data: {
        hashedPassword,
      },
    });

    return NextResponse.json({ status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message, status: 500 });
  }
}

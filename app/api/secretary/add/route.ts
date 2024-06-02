import { hashPassword } from "@/helper/authFunctions";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, gender } = await req.json();

    let checkPhoneNEmail = await db.secretary.findMany({
      where: {
        OR: [
          {
            phone,
          },
          {
            email,
          },
        ],
      },
    });

    if (checkPhoneNEmail.length === 0) {
      checkPhoneNEmail = (await db.doctor.findMany({
        where: {
          OR: [
            {
              phone,
            },
            {
              email,
            },
          ],
        },
      })) as any;
    }

    if (checkPhoneNEmail.length === 0) {
      checkPhoneNEmail = (await db.admin.findMany({
        where: {
          OR: [
            {
              phone,
            },
            {
              email,
            },
          ],
        },
      })) as any;
    }

    if (checkPhoneNEmail.length === 0) {
      checkPhoneNEmail = (await db.patient.findMany({
        where: {
          OR: [
            {
              phone,
            },
            {
              email,
            },
          ],
        },
      })) as any;
    }

    if (checkPhoneNEmail.length > 0) {
      return NextResponse.json({
        error: "Phone number or email already exists",
        status: 409,
      });
    }

    // set default password to 'admin+phone', and hash it 👇
    const hashedPassword = await hashPassword(`secretary${phone}`);

    const data = await db.secretary.create({
      data: {
        name,
        email,
        phone,
        hashedPassword,
        gender,
      },
    });

    return NextResponse.json({ data, status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message, status: 500 });
  }
}

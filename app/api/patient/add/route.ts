import { hashPassword } from "@/helper/authFunctions";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { name, phone, email, image, age, city, street, gender, note } =
      await req.json();

    let checkPhoneNEmail = await db.patient.findMany({
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
      checkPhoneNEmail = (await db.secretary.findMany({
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

    if (checkPhoneNEmail.length > 0) {
      return NextResponse.json({
        error: "Phone number or email already exists",
        status: 409,
      });
    }

    // set default password to 'patient+phone', and hash it 👇
    const hashedPassword = await hashPassword(`patient${phone}`);

    const data = await db.patient.create({
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
        hashedPassword,
      },
    });

    return NextResponse.json({ data, status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message, status: 500 });
  }
}

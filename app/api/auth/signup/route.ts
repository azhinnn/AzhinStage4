import { hashPassword } from "@/helper/authFunctions";
import { sendVerifyEmail } from "@/helper/emailActions/sendVerifyEmail";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const {
      name,
      phone,
      email,
      image,
      age,
      city,
      street,
      gender,
      note,
      password,
    } = await req.json();

    let checkPhoneNEmail = await db.patient.findFirst({
      where: {
        OR: [
          {
            phone,
          },
          {
            email: {
              equals: email,
              not: {
                equals: "",
              },
            },
          },
        ],
      },
    });

    if (!checkPhoneNEmail) {
      checkPhoneNEmail = (await db.secretary.findFirst({
        where: {
          OR: [
            {
              phone,
            },
            {
              email: {
                equals: email,
                not: {
                  equals: "",
                },
              },
            },
          ],
        },
      })) as any;
    }

    if (!checkPhoneNEmail) {
      checkPhoneNEmail = (await db.doctor.findFirst({
        where: {
          OR: [
            {
              phone,
            },
            {
              email: {
                equals: email,
                not: {
                  equals: "",
                },
              },
            },
          ],
        },
      })) as any;
    }

    if (!checkPhoneNEmail) {
      checkPhoneNEmail = (await db.admin.findFirst({
        where: {
          OR: [
            {
              phone,
            },
            {
              email: {
                equals: email,
                not: {
                  equals: "",
                },
              },
            },
          ],
        },
      })) as any;
    }

    if (checkPhoneNEmail) {
      return NextResponse.json({
        error: "Phone number or email already exists",
        status: 409,
      });
    }

    // hash the password 👇
    const hashedPassword = await hashPassword(password);

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

    // await sendVerifyEmail({
    //   email: data.email,
    //   name: data.name,
    // });

    return NextResponse.json({ data, status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message, status: 500 });
  }
}

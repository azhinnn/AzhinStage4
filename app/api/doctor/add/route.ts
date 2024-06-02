import { hashPassword } from "@/helper/authFunctions";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const {
      name,
      email,
      phone,
      gender,
      city,
      street,
      doctorFieldId,
      doctorTypeIds,
      image,
    } = await req.json();

    let checkPhoneNEmail = await db.doctor.findMany({
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
        errorType: "phoneOrEmailAlreadyExists",
      });
    }

    // set default password to 'doctor+phone', and hash it 👇
    const hashedPassword = await hashPassword(`doctor${phone}`);

    const data = await db.doctor.create({
      data: {
        name,
        email,
        phone,
        City: {
          connect: {
            id: Number(city),
          },
        },
        street,
        image,
        hashedPassword,
        gender,
        DoctorField: {
          connect: {
            id: Number(doctorFieldId),
          },
        },
        DoctorType: {
          connect: doctorTypeIds.map((id: number) => ({ id })),
        },
      },
    });

    return NextResponse.json({ data: data, status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message, status: 500 });
  }
}

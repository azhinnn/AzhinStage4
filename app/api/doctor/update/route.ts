import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const {
      id,
      name,
      email,
      phone,
      gender,
      city,
      street,
      doctorFieldId,
      doctorTypeIds,
    } = await req.json();

    const checkUser = await db.doctor.findFirst({
      where: {
        id: {
          not: Number(id),
        },
        OR: [{ email }, { phone }],
      },
    });

    if (checkUser && checkUser.id !== Number(id)) {
      return NextResponse.json({
        error: "Phone number or email already exists",
        status: 409,
      });
    }

    const user = await db.doctor.findUnique({
      where: {
        id: Number(id),
      },
      select: {
        id: true,
        DoctorField: {
          select: {
            id: true,
          },
        },
        DoctorType: {
          select: {
            id: true,
          },
        },
        City: {
          select: {
            id: true,
          },
        },
      },
    });

    const currentDoctorTypeIds = user?.DoctorType.map((item: any) => item.id);

    const data = await db.doctor.update({
      where: {
        id: Number(id),
      },
      data: {
        name,
        email,
        phone,
        gender,
        street,
        ...(city && {
          City: {
            connect: {
              id: Number(city),
            },
          },
        }),
        ...(doctorFieldId &&
          doctorTypeIds && {
            DoctorField: {
              connect: {
                id: Number(doctorFieldId),
              },
            },
            DoctorType: {
              // Connect new DoctorTypes
              connect: doctorTypeIds.map((id: number) => ({ id })),
              // Disconnect DoctorTypes not included in the new list
              disconnect: currentDoctorTypeIds
                ?.filter((id: number) => !doctorTypeIds.includes(id))
                .map((id: number) => ({ id })),
            },
          }),
      },
    });

    return NextResponse.json({ data, status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message, status: 500 });
  }
}

import { hashPassword } from "@/helper/authFunctions";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const {
      doctorId,
      patientId,
      patientName,
      patientPhone,
      patientEmail,
      patientAge,
      patientGender,
      patientCity,
      patientStreet,
      doctorTypeId,
      visitDate,
    } = await req.json();

    // check if appointment already exist for this doctor and patient 👇
    if (patientId) {
      const checkAppointment = await db.appointment.findFirst({
        where: {
          doctorId: Number(doctorId),
          patientId: Number(patientId),
          doctorTypeId: Number(doctorTypeId),
          status: {
            notIn: ["cancelled", "completed"],
          },
        },
      });

      if (checkAppointment)
        return NextResponse.json({
          error: "Appointment already exist",
          status: 409,
          errorType: "appointmentAlreadyExist",
        });
    }

    // check if a patient already exist with this phone or email 👇
    if (!patientId) {
      const checkPatientPhone = await db.patient.findFirst({
        where: {
          OR: [
            {
              phone: patientPhone,
            },
            {
              email: patientEmail,
            },
          ],
        },
      });

      if (checkPatientPhone) {
        return NextResponse.json({
          error: "Patient already exist with this Email or Phone Number.",
          status: 409,
          errorType: "phoneOrEmailAlreadyExists",
        });
      }
    }

    // set default password to 'admin+phone', and hash it 👇
    const hashedPassword = await hashPassword(`patient${patientPhone}`);

    const data = await db.appointment.create({
      data: {
        date: new Date(),
        Doctor: {
          connect: {
            id: Number(doctorId),
          },
        },
        DoctorType: {
          connect: {
            id: Number(doctorTypeId),
          },
        },
        Visit: {
          create: {
            date: visitDate + ":00.000Z",
          },
        },
        Patient: {
          ...(patientId
            ? {
                connect: {
                  id: Number(patientId),
                },
              }
            : {
                create: {
                  name: patientName,
                  phone: patientPhone,
                  email: patientEmail,
                  age: Number(patientAge),
                  gender: patientGender,
                  City: {
                    connect: {
                      id: Number(patientCity),
                    },
                  },
                  street: patientStreet,
                  hashedPassword,
                },
              }),
        },
      },
    });

    return NextResponse.json({ data, status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message, status: 500 });
  }
}

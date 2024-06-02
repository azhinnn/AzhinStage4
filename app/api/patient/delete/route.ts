import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();

    // Start a transaction
    const result = await db.$transaction(async (prisma) => {
      const checkAppointment = await prisma.appointment.findMany({
        where: {
          patientId: Number(id),
        },
        select: {
          id: true,
        },
      });

      if (checkAppointment.length > 0) {
        const appointmentIds = checkAppointment.map((item) => item.id);

        // Ensure all related transactions are deleted first
        await prisma.transaction.deleteMany({
          where: {
            appointmentId: {
              in: appointmentIds,
            },
          },
        });

        // Then delete visits
        await prisma.visit.deleteMany({
          where: {
            appointmentId: {
              in: appointmentIds,
            },
          },
        });

        // Finally, delete appointments
        await prisma.appointment.deleteMany({
          where: {
            id: {
              in: appointmentIds,
            },
          },
        });
      }

      // Delete the patient
      return prisma.patient.delete({
        where: {
          id: Number(id),
        },
      });
    });

    return NextResponse.json({ data: result, status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message, status: 500 });
  }
}

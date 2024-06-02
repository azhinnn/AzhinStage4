import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

interface Visit {
  id: number;
  date: any;
}

interface Appointment {
  id: number;
  date: any;
}

interface transaction {
  id: number;
  date: any;
}

interface patient {
  id: number;
  createdAt: any;
}

// a function to group items by date
// Updated groupByDate function to accept a property name
function groupByDate<T>(
  items: T[],
  dateProperty: keyof T
): { [key: string]: T[] } {
  return items.reduce((acc, item) => {
    const date = new Date(item[dateProperty] as string)
      .toISOString()
      .split("T")[0]
      .split("-")
      .slice(1)
      .join("/");
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(item);
    return acc;
  }, {} as { [key: string]: T[] });
}

// Usage for patientResponse

export async function POST(req: NextRequest) {
  try {
    const { from, to } = await req.json();

    const visitResponse = await db.visit.findMany({
      select: {
        id: true,
        date: true,
      },
      where: {
        date: {
          lt: to,
          gte: from,
        },
      },
    });

    const appointmentResponse = await db.appointment.findMany({
      select: {
        id: true,
        date: true,
      },
      where: {
        date: {
          lt: to,
          gte: from,
        },
      },
    });

    const transactionResponse = await db.transaction.findMany({
      select: {
        id: true,
        date: true,
      },
      where: {
        date: {
          lt: to,
          gte: from,
        },
      },
    });

    const patientResponse = await db.patient.findMany({
      select: {
        id: true,
        createdAt: true,
      },
      where: {
        createdAt: {
          lt: to,
          gte: from,
        },
      },
    });

    const groupedVisits = groupByDate<Visit>(visitResponse, "date");
    const groupedAppointments = groupByDate<Appointment>(
      appointmentResponse,
      "date"
    );
    const groupedTransactions = groupByDate<transaction>(
      transactionResponse,
      "date"
    );
    const groupedPatients = groupByDate<patient>(patientResponse, "createdAt");

    const visitDates = Object.keys(groupedVisits) || [];
    const visitCount =
      Object.values(groupedVisits).map((group) => group.length) || [];

    const appointmentDates = Object.keys(groupedAppointments) || [];
    const appointmentCount =
      Object.values(groupedAppointments).map((group) => group.length) || [];

    const transactionDates = Object.keys(groupedTransactions) || [];
    const transactionCount =
      Object.values(groupedTransactions).map((group) => group.length) || [];

    const patientDates = Object.keys(groupedPatients) || [];
    const patientCount =
      Object.values(groupedPatients).map((group) => group.length) || [];

    return NextResponse.json({
      visitData: {
        visitDates,
        visitCount,
      },
      appointmentData: {
        appointmentDates,
        appointmentCount,
      },
      transactionData: {
        transactionDates,
        transactionCount,
      },
      patientData: {
        patientDates,
        patientCount,
      },
      status: 200,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message, status: 500 });
  }
}

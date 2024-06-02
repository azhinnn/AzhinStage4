"use server";

import { db } from "@/lib/db";

interface FunProps {
  from: Date | undefined;
  to: Date | undefined;
}
// Helper function to count records based on date range
async function countRecords(
  model: any,
  dateField: string,
  { from, to }: FunProps
) {
  return await model.count({
    where: {
      ...(from && to && { [dateField]: { gte: from, lte: to } }),
    },
  });
}

export async function NumbericAnalyticData({ from, to }: FunProps) {
  const totalDoctors = await countRecords(db.doctor, "createdAt", { from, to });
  const totalPatients = await countRecords(db.patient, "createdAt", {
    from,
    to,
  });
  const totalAppointments = await countRecords(db.appointment, "date", {
    from,
    to,
  });
  const totalVisits = await countRecords(db.visit, "date", { from, to });
  const totalTransactions = await countRecords(db.transaction, "date", {
    from,
    to,
  });
  const totalDoctorFields = await countRecords(db.doctorfield, "createdAt", {
    from,
    to,
  });
  const totalDoctorTypes = await countRecords(db.doctortype, "createdAt", {
    from,
    to,
  });

  return {
    totalDoctors,
    totalPatients,
    totalAppointments,
    totalVisits,
    totalTransactions,
    totalDoctorFields,
    totalDoctorTypes,
  };
}

export async function patientsByDoctors({ from, to }: FunProps) {
  const data = await db.appointment.groupBy({
    by: ["doctorId"],
    _count: {
      patientId: true,
    },
    ...(from && to && { where: { date: { gte: from, lte: to } } }),
  });

  const doctorName = await db.doctor.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  data.forEach((item: any) => {
    const doctor = doctorName.find(
      (doctor: any) => doctor.id === item.doctorId
    );
    item.id = doctor?.name;
    item.value = item._count.patientId;
  });

  return data || [];
}

export async function NumberOfVisitsByEachDoctor({ from, to }: FunProps) {
  const apps = await db.appointment.findMany({
    select: {
      id: true,
      Doctor: {
        select: {
          id: true,
          name: true,
        },
      },
      Visit: {
        select: {
          id: true,
        },
      },
    },
    ...(from && to && { where: { date: { gte: from, lte: to } } }),
  });

  const doctorVisits = apps.reduce((acc: any, curr) => {
    const doctorName = curr.Doctor.name;
    const visitCount = curr.Visit.length;

    acc[doctorName] = (acc[doctorName] || 0) + visitCount;

    return acc;
  }, {});

  const data = Object.entries(doctorVisits).map(([id, value]) => ({
    id,
    value,
  }));

  return data || [];
}

export async function NumberOfTransactionsByEachDoctor({ from, to }: FunProps) {
  const transactions = await db.transaction.findMany({
    select: {
      id: true,
      appointmentId: true,
    },
    ...(from && to && { where: { date: { gte: from, lte: to } } }),
  });

  const doctors = await db.doctor.findMany({
    select: {
      id: true,
      name: true,
      Appointment: {
        select: {
          id: true,
        },
      },
    },
  });

  const doctorsWithTransactions = doctors
    .filter((doctor: any) => {
      const doctorTransactions = transactions.filter((transaction: any) =>
        doctor.Appointment.some(
          (appointment: any) => appointment.id === transaction.appointmentId
        )
      );

      return doctorTransactions.length > 0;
    })
    .map((doctor: any) => {
      const doctorTransactions = transactions.filter((transaction: any) =>
        doctor.Appointment.some(
          (appointment: any) => appointment.id === transaction.appointmentId
        )
      );

      return {
        name: doctor.name,
        value: doctorTransactions.length,
      };
    });

  return doctorsWithTransactions || [];
}

export async function TotalAmountOfTransactionByEachDoctor({
  from,
  to,
}: FunProps) {
  // Fetch all transactions with their associated doctor and amount
  const transactions = await db.transaction.findMany({
    select: {
      Appointment: {
        select: {
          Doctor: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      amount: true,
    },
    ...(from && to && { where: { date: { gte: from, lte: to } } }),
  });

  const totalAmountByEachDoctor = transactions.reduce<any>(
    (acc, transaction) => {
      const doctorName = transaction.Appointment.Doctor.name;

      const existingDoctor = acc.find((item: any) => item.x === doctorName);
      if (existingDoctor) {
        existingDoctor.y = Number(existingDoctor.y.toFixed(2));
        existingDoctor.y += transaction.amount;
      } else {
        acc.push({ x: doctorName, y: Number(transaction.amount.toFixed(2)) });
      }
      return acc;
    },
    []
  );

  return totalAmountByEachDoctor || [];
}

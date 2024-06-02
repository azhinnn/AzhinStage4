"use server";

import { db } from "@/lib/db";
import { format } from "date-fns";

const LOCALHOST = process.env.LOCALHOST;

export async function getDoctorFields() {
  const res = await fetch(`${LOCALHOST}/api/doctorField/get`, {
    cache: "no-store",
    method: "POST",
  });
  const data = await res.json();
  return data;
}

export async function getDoctorField(id: any) {
  const res = await fetch(`${LOCALHOST}/api/doctorField/getOne`, {
    body: JSON.stringify({ id }),
    cache: "no-store",
    method: "POST",
  });

  const response = await res.json();
  return response;
}

export async function getDoctorFieldList(search: string) {
  const data = await db.doctorfield.findMany({
    where: {
      name: {
        contains: search,
      },
    },
  });

  return data;
}

export async function addDoctorField(data: any) {
  const res = await fetch(`${LOCALHOST}/api/doctorField/add`, {
    method: "POST",
    body: JSON.stringify(data),
    cache: "no-store",
  });
  const response = await res.json();
  return response;
}

export async function updateDoctorField(data: any) {
  const res = await fetch(`${LOCALHOST}/api/doctorField/update`, {
    method: "POST",
    body: JSON.stringify(data),
    cache: "no-store",
  });
  const response = await res.json();
  return response;
}

export async function deleteDoctorField(id: any) {
  const res = await fetch(`${LOCALHOST}/api/doctorField/delete`, {
    method: "DELETE",
    body: JSON.stringify({ id }),
    cache: "no-store",
  });
  const response = await res.json();
  return response;
}

export async function doctorFieldAnalyticData({
  doctorFieldId,
  from,
  to,
}: {
  doctorFieldId: number | string;
  from: Date | undefined;
  to: Date | undefined;
}) {
  const appointments = await db.appointment.count({
    where: {
      DoctorType: {
        doctorFieldId: Number(doctorFieldId),
      },
      ...(from && to && { createdAt: { gte: from, lte: to } }),
    },
  });

  const appointmentStatusData = await db.appointment.groupBy({
    _count: {
      id: true,
    },
    by: ["status"],
    where: {
      DoctorType: {
        doctorFieldId: Number(doctorFieldId),
      },
      ...(from && to && { createdAt: { gte: from, lte: to } }),
    },
  });

  const appointmentStatus = appointmentStatusData.map((item) => ({
    id: item.status,
    value: item._count.id,
  }));

  const visits = await db.visit.count({
    where: {
      Appointment: {
        DoctorType: {
          doctorFieldId: Number(doctorFieldId),
        },
      },
      ...(from && to && { date: { gte: from, lte: to } }),
    },
  });

  const visitDateData = await db.visit.groupBy({
    by: ["date"],
    _count: {
      _all: true,
    },
    where: {
      Appointment: {
        DoctorType: {
          doctorFieldId: Number(doctorFieldId),
        },
      },
      ...(from && to && { date: { gte: from, lte: to } }),
    },
  });

  const groupedVisitDateData = visitDateData.reduce((acc: any, item) => {
    const dateString = format(item.date, "dd/MM");
    if (acc[dateString]) {
      acc[dateString].y += 1;
    } else {
      acc[dateString] = { x: dateString, y: 1 };
    }
    return acc;
  }, {});

  const visitsDate = Object.values(groupedVisitDateData);

  const visitStatusData = await db.visit.groupBy({
    by: ["status"],
    _count: {
      id: true,
    },
    where: {
      Appointment: {
        DoctorType: {
          doctorFieldId: Number(doctorFieldId),
        },
      },
      ...(from && to && { date: { gte: from, lte: to } }),
    },
  });

  const visitStatus = visitStatusData.map((item) => ({
    id: item.status,
    value: item._count.id,
  }));

  const transactions = await db.transaction.count({
    where: {
      Appointment: {
        DoctorType: {
          doctorFieldId: Number(doctorFieldId),
        },
      },
      ...(from && to && { date: { gte: from, lte: to } }),
    },
  });

  const transactionDateData = await db.transaction.groupBy({
    by: ["date"],
    _sum: {
      amount: true,
    },
    where: {
      Appointment: {
        DoctorType: {
          doctorFieldId: Number(doctorFieldId),
        },
      },
      ...(from && to && { date: { gte: from, lte: to } }),
    },
  });

  const groupedTransactionDateData = transactionDateData.reduce(
    (acc: any, item) => {
      const date = new Date(
        item.date.getFullYear(),
        item.date.getMonth(),
        item.date.getDate()
      );
      const existingEntry: any = acc.find(
        (entry: any) => entry.date.getTime() === date.getTime()
      );

      if (existingEntry !== undefined) {
        existingEntry._sum.amount += item._sum.amount;
      } else {
        acc.push({
          _sum: { amount: item._sum.amount },
          date,
        });
      }

      return acc;
    },
    []
  );

  const transactionDate = groupedTransactionDateData.map((item: any) => ({
    x: format(item.date, "dd/MM"),
    y: item._sum.amount,
  }));

  const transactionAmountData = await db.transaction.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      Appointment: {
        DoctorType: {
          doctorFieldId: Number(doctorFieldId),
        },
      },
      ...(from && to && { date: { gte: from, lte: to } }),
    },
  });

  const transactionAmount = transactionAmountData._sum.amount;

  const waitings = await db.waiting.count({
    where: {
      doctorFieldId: Number(doctorFieldId),
      ...(from && to && { date: { gte: from, lte: to } }),
    },
  });

  return {
    appointments,
    appointmentStatus,
    visits,
    visitsDate,
    visitStatus,
    transactions,
    transactionDate,
    transactionAmount,
    waitings,
  };
}

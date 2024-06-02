"use server";

import { db } from "@/lib/db";
import { format } from "date-fns";

const LOCALHOST = process.env.LOCALHOST;

export async function getDoctorTypes() {
  const res = await fetch(`${LOCALHOST}/api/doctorType/get`, {
    cache: "no-store",
    method: "POST",
  });

  const response = await res.json();
  return response;
}

export async function getDoctorTypeList(id: any) {
  const res = await fetch(`${LOCALHOST}/api/doctorType/getList`, {
    method: "POST",
    body: JSON.stringify({ id }),
    cache: "no-store",
  });

  const response = await res.json();
  return response;
}

export async function getDoctorTypeListByName(name: string) {
  const data = await db.doctortype.findMany({
    where: {
      name: {
        contains: name,
      },
    },
    include: {
      DoctorField: true,
    },
  });

  return data;
}

export async function getDoctorType(id: any) {
  const res = await fetch(`${LOCALHOST}/api/doctorType/getOne`, {
    method: "POST",
    body: JSON.stringify({ id }),
    cache: "no-store",
  });

  const response = await res.json();
  return response;
}

export async function addDoctorType(data: any) {
  const res = await fetch(`${LOCALHOST}/api/doctorType/add`, {
    method: "POST",
    body: JSON.stringify(data),
    cache: "no-store",
  });

  const response = await res.json();
  return response;
}

export async function updateDoctorType(data: any) {
  const res = await fetch(`${LOCALHOST}/api/doctorType/update`, {
    method: "POST",
    body: JSON.stringify(data),
    cache: "no-store",
  });

  const response = await res.json();
  return response;
}

export async function deleteDoctorType(id: any) {
  const res = await fetch(`${LOCALHOST}/api/doctorType/delete`, {
    method: "DELETE",
    body: JSON.stringify({ id }),
    cache: "no-store",
  });

  const response = await res.json();
  return response;
}

export async function doctorTypeAnalyticData({
  doctorTypeId,
  from,
  to,
}: {
  doctorTypeId: number | string;
  from: Date | undefined;
  to: Date | undefined;
}) {
  const appointments = await db.appointment.count({
    where: {
      doctorTypeId: Number(doctorTypeId),
      ...(from && to && { createdAt: { gte: from, lte: to } }),
    },
  });

  const appointmentStatusData = await db.appointment.groupBy({
    _count: {
      id: true,
    },
    by: ["status"],
    where: {
      doctorTypeId: Number(doctorTypeId),
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
        doctorTypeId: Number(doctorTypeId),
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
        doctorTypeId: Number(doctorTypeId),
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
        doctorTypeId: Number(doctorTypeId),
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
        doctorTypeId: Number(doctorTypeId),
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
        doctorTypeId: Number(doctorTypeId),
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
        doctorTypeId: Number(doctorTypeId),
      },
      ...(from && to && { date: { gte: from, lte: to } }),
    },
  });

  const transactionAmount = transactionAmountData._sum.amount;

  const waitings = await db.waiting.count({
    where: {
      doctorTypeId: Number(doctorTypeId),
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

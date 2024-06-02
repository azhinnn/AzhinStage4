"use server";

import { db } from "@/lib/db";
import { format } from "date-fns";

const LOCALHOST = process.env.LOCALHOST;

export async function GetDoctors() {
  const res = await fetch(`${LOCALHOST}/api/doctor/get`, {
    method: "POST",
    cache: "no-cache",
  });

  const response = (await res.json()) || [];
  return response;
}

export async function GetDoctor(id: any) {
  const res = await fetch(`${LOCALHOST}/api/doctor/getOne`, {
    method: "POST",
    body: JSON.stringify({ id }),
    cache: "no-cache",
  });

  const response = await res.json();
  return response;
}

export async function GetDoctorList(data: any) {
  const res = await fetch(`${LOCALHOST}/api/doctor/getList`, {
    method: "POST",
    cache: "no-cache",
    body: JSON.stringify(data),
  });

  const response = await res.json();
  return response;
}

export async function GetDoctorListByType(id: any) {
  const res = await fetch(`${LOCALHOST}/api/doctor/getListByType`, {
    method: "POST",
    body: JSON.stringify({ id }),
    cache: "no-cache",
  });

  const response = await res.json();
  return response;
}

export async function AddDoctor({ data }: { data: any }) {
  const res = await fetch(`${LOCALHOST}/api/doctor/add`, {
    method: "POST",
    body: JSON.stringify(data),
    cache: "no-cache",
  });

  const response = await res.json();
  return response;
}

export async function UpdateDoctor({ data }: { data: any }) {
  const res = await fetch(`${LOCALHOST}/api/doctor/update`, {
    method: "POST",
    body: JSON.stringify(data),
    cache: "no-cache",
  });
  const response = await res.json();
  return response;
}

export async function updateDoctorImage(data: any) {
  const res = await fetch(`${LOCALHOST}/api/doctor/updateDoctorImage`, {
    method: "POST",
    body: JSON.stringify(data),
    cache: "no-store",
  });

  const response = await res.json();
  return response;
}

export async function updateDoctorPassword(data: any) {
  const res = await fetch(`${LOCALHOST}/api/doctor/updatePassword`, {
    method: "POST",
    body: JSON.stringify(data),
    cache: "no-store",
  });

  const response = await res.json();
  return response;
}

export async function DeleteDoctor(data: any) {
  const res = await fetch(`${LOCALHOST}/api/doctor/delete`, {
    method: "DELETE",
    cache: "no-cache",
    body: JSON.stringify(data),
  });
  const response = await res.json();

  return response;
}

export async function DoctorAnalyticData({
  doctorId,
  from,
  to,
}: {
  doctorId: number | string;
  from: Date | undefined;
  to: Date | undefined;
}) {
  const appointments = await db.appointment.count({
    where: {
      doctorId: Number(doctorId),
      ...(from && to && { date: { gte: from, lte: to } }),
    },
  });

  const appointmentStatusData = await db.appointment.groupBy({
    by: ["status"],
    _count: {
      id: true,
    },
    where: {
      doctorId: Number(doctorId),
      ...(from && to && { date: { gte: from, lte: to } }),
    },
  });

  const appointmentStatus = appointmentStatusData.map((item) => ({
    id: item.status,
    value: item._count.id,
  }));

  const visits = await db.visit.count({
    where: {
      Appointment: {
        doctorId: Number(doctorId),
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
        doctorId: Number(doctorId),
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
        doctorId: Number(doctorId),
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
        doctorId: Number(doctorId),
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
        doctorId: Number(doctorId),
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
        doctorId: Number(doctorId),
      },
      ...(from && to && { date: { gte: from, lte: to } }),
    },
  });

  const transactionAmount = transactionAmountData._sum.amount;

  const waitings = await db.waiting.count({
    where: {
      doctorId: Number(doctorId),
      ...(from && to && { createdAt: { gte: from, lte: to } }),
    },
  });

  return {
    appointments,
    appointmentStatus,
    visits,
    visitsDate,
    visitStatus,
    transactions,
    transactionAmount,
    transactionDate,
    waitings,
  };
}

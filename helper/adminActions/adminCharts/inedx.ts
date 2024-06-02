"use server";

import { db } from "@/lib/db";

const LOCALHOST = process.env.LOCALHOST;

export async function getAreaChartData(date: any) {
  const res = await fetch(`${LOCALHOST}/api/admin/charts/area`, {
    cache: "no-store",
    method: "POST",
    body: JSON.stringify(date),
  });
  const data = await res.json();
  return data;
}

export async function getDashboardData({
  lastWeekEnd,
  lastMonth,
}: {
  lastWeekEnd: Date;
  lastMonth: Date;
}) {
  return await Promise.all([
    db.appointment.count({
      where: {
        date: {
          gte: lastWeekEnd,
        },
      },
    }),
    db.appointment.count({
      where: {
        date: {
          gte: lastWeekEnd,
        },
      },
    }),
    db.patient.count({
      where: {
        createdAt: {
          gte: lastWeekEnd,
        },
      },
    }),
    db.patient.count({
      where: {
        createdAt: {
          gte: lastWeekEnd,
        },
      },
    }),
    db.visit.count({
      where: {
        date: {
          gte: lastWeekEnd,
        },
      },
    }),
    db.visit.count({
      where: {
        date: {
          gte: lastWeekEnd,
        },
      },
    }),
    db.waiting.count({
      where: {
        createdAt: {
          gte: lastWeekEnd,
        },
      },
    }),
    db.waiting.count({
      where: {
        createdAt: {
          gte: lastWeekEnd,
        },
      },
    }),
    db.transaction.count({
      where: {
        date: {
          gte: lastMonth,
        },
      },
    }),
    db.transaction.count({
      where: {
        date: {
          gte: lastWeekEnd,
        },
      },
    }),
    db.transaction.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        date: {
          gte: lastMonth,
        },
      },
    }),
    db.transaction.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        date: {
          gte: lastWeekEnd,
        },
      },
    }),
  ]);
}

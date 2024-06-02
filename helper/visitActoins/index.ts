"use server";

import { db } from "@/lib/db";

const LOCALHOST = process.env.LOCALHOST;

// get visit list by id
export async function getVisitListById({ id }: { id: number | string }) {
  const res = await fetch(`${process.env.LOCALHOST}/api/visit/getList`, {
    method: "POST",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      appointmentId: id,
    }),
  });
  const response = await res.json();
  return response;
}

export async function getDoctorVisits() {
  const res = await fetch(`${LOCALHOST}/api/visit/get`, {
    cache: "no-store",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const response = await res.json();
  return response;
}

export async function addNextVisit({ data }: { data: any }) {
  const res = await fetch(`${LOCALHOST}/api/visit/add`, {
    method: "POST",
    cache: "no-store",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const response = await res.json();
  return response;
}

export async function getVisitsByAppointment({ data }: { data: any }) {
  const res = await fetch(`${LOCALHOST}/api/visit/getList`, {
    method: "POST",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const response = await res.json();
  return response;
}

export async function getVisitByDoctorNType({ data }: { data: any }) {
  const res = await fetch(`${LOCALHOST}/api/visit/getListByDoctorNType`, {
    method: "POST",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const response = await res.json();
  return response;
}

export async function updateVisitStatus({ data }: { data: any }) {
  const res = await fetch(`${LOCALHOST}/api/visit/update`, {
    method: "POST",
    cache: "no-store",
    body: JSON.stringify(data),
  });
  const response = await res.json();
  return response;
}

export async function updateVisitTime({ data }: { data: any }) {
  const res = await fetch(`${LOCALHOST}/api/visit/updateTime`, {
    method: "POST",
    cache: "no-store",
    body: JSON.stringify(data),
  });

  const response = await res.json();
  return response;
}

export async function updateVisitNote({ data }: { data: any }) {
  const res = await fetch(`${LOCALHOST}/api/visit/updateNote`, {
    method: "POST",
    cache: "no-store",
    body: JSON.stringify(data),
  });
  const response = await res.json();
  return response;
}

export async function deleteVisit({ data }: { data: any }) {
  const res = await fetch(`${LOCALHOST}/api/visit/delete`, {
    method: "DELETE",
    cache: "no-store",
    body: JSON.stringify(data),
  });
  const response = await res.json();
  return response;
}

export async function updateVisitImage(id: number, image: string) {
  try {
    await db.visit.update({
      where: { id: Number(id) },
      data: { image },
    });
    return { success: "Image updated successfully" };
  } catch (error: any) {
    return { error: "Something went wrong" };
  }
}

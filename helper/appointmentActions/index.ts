"use server";

const LOCALHOST = process.env.LOCALHOST;

export async function getAppointment(data: any) {
  const res = await fetch(`${LOCALHOST}/api/appointment/getOne`, {
    cache: "no-store",
    method: "POST",
    body: JSON.stringify(data),
  });

  const response = await res.json();
  return response;
}

export async function getAppointments() {
  const res = await fetch(`${LOCALHOST}/api/appointment/get`, {
    method: "POST",
    cache: "no-store",
  });

  const response = await res.json();
  return response;
}

export async function getAppointmentByPhoneNID(data: any) {
  const res = await fetch(`${LOCALHOST}/api/appointment/getByPhoneNID`, {
    cache: "no-store",
    method: "POST",
    body: JSON.stringify(data),
  });

  const response = await res.json();
  return response;
}

export async function addAppointment(data: any) {
  const res = await fetch(`${LOCALHOST}/api/appointment/add`, {
    method: "POST",
    body: JSON.stringify(data),
    cache: "no-store",
  });

  const response = await res.json();
  return response;
}

export async function applyDiscountCode(data: any) {
  const res = await fetch(`${LOCALHOST}/api/appointment/applyDiscount`, {
    method: "POST",
    body: JSON.stringify(data),
    cache: "no-store",
  });

  const response = await res.json();
  return response;
}

export async function deleteAppointment(id: number) {
  const res = await fetch(`${LOCALHOST}/api/appointment/delete`, {
    cache: "no-store",
    method: "DELETE",
    body: JSON.stringify({ id }),
  });

  const response = await res.json();
  return response;
}

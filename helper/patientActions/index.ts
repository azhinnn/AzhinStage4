"use server";

const LOCALHOST = process.env.LOCALHOST;

export async function getPatients() {
  const res = await fetch(`${LOCALHOST}/api/patient/get`, {
    method: "POST",
    cache: "no-store",
  });
  const response = await res.json();
  return response;
}

export async function getPatient(id: any) {
  const res = await fetch(`${LOCALHOST}/api/patient/getOne`, {
    method: "POST",
    body: JSON.stringify({ id }),
    cache: "no-store",
  });
  const response = await res.json();
  return response;
}

export async function getPatientList(data: any) {
  const res = await fetch(`${LOCALHOST}/api/patient/getList`, {
    method: "POST",
    body: JSON.stringify(data),
    cache: "no-store",
  });

  const response = await res.json();
  return response;
}

export async function addPatient(data: any) {
  const res = await fetch(`${LOCALHOST}/api/patient/add`, {
    method: "POST",
    body: JSON.stringify(data),
    cache: "no-store",
  });
  const response = await res.json();
  return response;
}

export async function updatePatient(data: any) {
  const res = await fetch(`${LOCALHOST}/api/patient/update`, {
    method: "POST",
    body: JSON.stringify(data),
    cache: "no-store",
  });
  const response = await res.json();
  return response;
}

export async function updatePatientPassword(data: any) {
  const res = await fetch(`${LOCALHOST}/api/patient/updatePassword`, {
    method: "POST",
    body: JSON.stringify(data),
    cache: "no-store",
  });
  const response = await res.json();
  return response;
}

export async function deletePatient(id: any) {
  const res = await fetch(`${LOCALHOST}/api/patient/delete`, {
    method: "DELETE",
    body: JSON.stringify({ id }),
    cache: "no-store",
  });

  const response = await res.json();
  return response;
}

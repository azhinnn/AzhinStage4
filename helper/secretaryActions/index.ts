"use server";

const LOCALHOST = process.env.LOCALHOST;

export async function getSecretaries() {
  const res = await fetch(`${LOCALHOST}/api/secretary/get`, {
    cache: "no-store",
    method: "POST",
  });

  const response = await res.json();
  return response;
}

export async function getSecretary(id: any) {
  const res = await fetch(`${LOCALHOST}/api/secretary/getOne`, {
    body: JSON.stringify({ id }),
    cache: "no-store",
    method: "POST",
  });

  const response = await res.json();
  return response;
}

export async function addSecretary(data: any) {
  const res = await fetch(`${LOCALHOST}/api/secretary/add`, {
    method: "POST",
    body: JSON.stringify(data),
    cache: "no-store",
  });

  const response = await res.json();
  return response;
}

export async function updateSecretary(data: any) {
  const res = await fetch(`${LOCALHOST}/api/secretary/update`, {
    method: "POST",
    body: JSON.stringify(data),
    cache: "no-store",
  });

  const response = await res.json();
  return response;
}

export async function updateSecretaryImage(data: any) {
  const res = await fetch(`${LOCALHOST}/api/secretary/updateSecretaryImage`, {
    method: "POST",
    body: JSON.stringify(data),
    cache: "no-store",
  });

  const response = await res.json();
  return response;
}

export async function updateSecretaryPassword(data: any) {
  const res = await fetch(`${LOCALHOST}/api/secretary/updatePassword`, {
    method: "POST",
    body: JSON.stringify(data),
    cache: "no-store",
  });

  const response = await res.json();
  return response;
}

export async function deleteSecretary(id: any) {
  const res = await fetch(`${LOCALHOST}/api/secretary/delete`, {
    method: "DELETE",
    body: JSON.stringify({ id }),
    cache: "no-store",
  });

  const response = await res.json();
  return response;
}

"use server";

const LOCALHOST = process.env.LOCALHOST;

export async function getAdmins() {
  const res = await fetch(`${LOCALHOST}/api/admin/get`, {
    cache: "no-store",
    method: "POST",
  });

  const response = await res.json();
  return response;
}

export async function getAdmin(id: any) {
  const res = await fetch(`${LOCALHOST}/api/admin/getOne`, {
    body: JSON.stringify({ id }),
    cache: "no-store",
    method: "POST",
  });

  const response = await res.json();
  return response;
}

export async function addAdmin(data: any) {
  const res = await fetch(`${LOCALHOST}/api/admin/add`, {
    method: "POST",
    body: JSON.stringify(data),
    cache: "no-store",
  });
  const response = await res.json();
  return response;
}

export async function updateAdmin(data: any) {
  const res = await fetch(`${LOCALHOST}/api/admin/update`, {
    method: "POST",
    body: JSON.stringify(data),
    cache: "no-store",
  });
  const response = await res.json();
  return response;
}

export async function updateAdminImage(data: any) {
  const res = await fetch(`${LOCALHOST}/api/admin/updateAdminImage`, {
    method: "POST",
    body: JSON.stringify(data),
    cache: "no-store",
  });

  const response = await res.json();
  return response;
}

export async function updateAdminPassword(data: any) {
  const res = await fetch(`${LOCALHOST}/api/admin/updatePassword`, {
    method: "POST",
    body: JSON.stringify(data),
    cache: "no-store",
  });

  const response = await res.json();
  return response;
}

export async function deleteAdmin(id: any) {
  const res = await fetch(`${LOCALHOST}/api/admin/delete`, {
    method: "POST",
    body: JSON.stringify({ id }),
    cache: "no-store",
  });

  const response = await res.json();
  return response;
}

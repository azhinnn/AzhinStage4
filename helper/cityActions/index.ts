"use server";

const LOCALHOST = process.env.LOCALHOST;

export async function getCities() {
  const res = await fetch(`${LOCALHOST}/api/city/get`, {
    cache: "no-store",
    method: "POST",
  });
  const response = await res.json();
  return response;
}

export async function addCity(data: any) {
  const res = await fetch(`${LOCALHOST}/api/city/add`, {
    method: "POST",
    body: JSON.stringify(data),
    cache: "no-store",
  });
  const response = await res.json();
  return response;
}

export async function updateCity(data: any) {
  const res = await fetch(`${LOCALHOST}/api/city/update`, {
    method: "POST",
    body: JSON.stringify(data),
    cache: "no-store",
  });
  const response = await res.json();
  return response;
}

export async function deleteCity(data: any) {
  const res = await fetch(`${LOCALHOST}/api/city/delete`, {
    method: "DELETE",
    body: JSON.stringify(data),
    cache: "no-store",
  });
  const response = await res.json();
  return response;
}

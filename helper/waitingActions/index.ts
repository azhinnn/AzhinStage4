"use server";

const LOCALHOST = process.env.LOCALHOST;

// get waiting
export async function getWaitings() {
  const res = await fetch(`${LOCALHOST}/api/waiting/get`, {
    cache: "no-store",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const response = await res.json();
  return response;
}

// add waiting
export async function addWaiting(data: any) {
  const res = await fetch(`${LOCALHOST}/api/waiting/add`, {
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

// update waiting
export async function updateWaitingStatus(data: any) {
  const res = await fetch(`${LOCALHOST}/api/waiting/update`, {
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

"use server";

const LOCALHOST = process.env.LOCALHOST;
// get currentcy
export async function getCurrency() {
  const res = await fetch(`${LOCALHOST}/api/currency`, {
    method: "GET",
    cache: "no-store",
  });
  const response = await res.json();

  return response;
}

// add currency
export async function setCurrency(data: any) {
  const res = await fetch(`${LOCALHOST}/api/currency`, {
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

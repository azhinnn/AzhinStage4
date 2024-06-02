"use server";

const LOCALHOST = process.env.LOCALHOST;

export async function getDebts() {
  const res = await fetch(`${LOCALHOST}/api/debit/get`, {
    cache: "no-store",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const response = await res.json();
  return response;
}

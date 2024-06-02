"use server";

const LOCALHOST = process.env.LOCALHOST;

export async function getTransactions() {
  const res = await fetch(`${LOCALHOST}/api/transaction/get`, {
    cache: "no-store",
    method: "POST",
  });
  const response = await res.json();
  return response;
}

export async function addTransaction(data: any) {
  const res = await fetch(`${LOCALHOST}/api/transaction/add`, {
    method: "POST",
    body: JSON.stringify(data),
    cache: "no-store",
  });

  const response = await res.json();
  return response;
}

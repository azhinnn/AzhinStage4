"use server";

const LOCALHOST = process.env.LOCALHOST;

export async function getDiscounts() {
  const res = await fetch(`${LOCALHOST}/api/discount/get`, {
    cache: "no-store",
    method: "POST",
  });
  const data = await res.json();
  return data;
}

export async function addDiscount(data: any) {
  const res = await fetch(`${LOCALHOST}/api/discount/add`, {
    method: "POST",
    body: JSON.stringify(data),
    cache: "no-cache",
  });

  const response = await res.json();
  return response;
}

export async function deleteDiscount(id: any) {
  const res = await fetch(`${LOCALHOST}/api/discount/delete`, {
    method: "DELETE",
    body: JSON.stringify({ id }),
    cache: "no-store",
  });

  const response = await res.json();
  return response;
}

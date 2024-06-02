"use server";

export async function getCompany() {
  const res = await fetch(`${process.env.LOCALHOST}/api/company/get`, {
    cache: "no-store",
    method: "POST",
  });
  const response = await res.json();
  return response;
}

export async function updateCompany(data: any) {
  const res = await fetch(`${process.env.LOCALHOST}/api/company/update`, {
    method: "POST",
    body: JSON.stringify(data),
    cache: "no-store",
  });
  const response = await res.json();
  return response;
}

export async function updateCompanyImage(data: any) {
  const res = await fetch(
    `${process.env.LOCALHOST}/api/company/updateCompanyImage`,
    {
      method: "POST",
      body: JSON.stringify(data),
      cache: "no-store",
    }
  );
  const response = await res.json();
  return response;
}

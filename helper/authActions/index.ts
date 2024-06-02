export async function signupUser(data: any) {
  const res = await fetch(`/api/auth/signup`, {
    method: "POST",
    body: JSON.stringify(data),
    cache: "no-store",
  });
  const response = await res.json();
  return response;
}

export async function loginUser(data: any) {
  const res = await fetch(`/api/auth/login`, {
    method: "POST",
    body: JSON.stringify(data),
    cache: "no-store",
  });
  const response = await res.json();
  return response;
}

export async function logoutUser() {
  const res = await fetch(`/api/auth/logout`, {
    method: "POST",
    cache: "no-store",
  });
  const response = await res.json();
  return response;
}

export async function getUserCookie() {
  const res = await fetch(`/api/auth/getCookie`, {
    method: "POST",
    cache: "no-store",
  });
  const response = await res.json();
  return response;
}

export async function setUserCookie(token: string) {
  const res = await fetch(`/api/auth/setCookie`, {
    method: "POST",
    body: JSON.stringify({ token }),
    cache: "no-store",
  });
  const response = await res.json();
  return response;
}

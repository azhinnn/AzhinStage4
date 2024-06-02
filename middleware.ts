import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const COOCKIE_SECRET = process.env.COOCKIE_SECRET;
  const currentUrl = request.nextUrl.pathname;

  // recive cookie 👇
  const cookie = request.cookies.get("clincAuth")?.value;
  if (!cookie) return null;

  // if the user is not authenticated, redirect to the home page 👇
  if (
    !cookie &&
    (currentUrl.startsWith("/admin") ||
      currentUrl.startsWith("/patient") ||
      currentUrl.startsWith("/doctor") ||
      currentUrl.startsWith("/secretary"))
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // decrypte the cookie 👇
  const { payload } = await jwtVerify(
    cookie,
    new TextEncoder().encode(COOCKIE_SECRET),
    {
      algorithms: ["HS256"],
    }
  );

  // check if cookie expired or not 👇
  if (payload?.exp && payload?.exp < new Date().getTime() / 1000) {
    cookies().delete("clincAuth");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const type = payload?.type;

  // if the user is not in its role, redirect them to the home page 👇
  if (type === "patient" && !currentUrl.startsWith("/patient")) {
    return NextResponse.redirect(new URL("/patient/dashboard", request.url));
  }
  if (type === "admin" && !currentUrl.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }
  if (type === "doctor" && !currentUrl.startsWith("/doctor")) {
    return NextResponse.redirect(new URL("/doctor/dashboard", request.url));
  }
  if (type === "secretary" && !currentUrl.startsWith("/secretary")) {
    return NextResponse.redirect(new URL("/secretary/dashboard", request.url));
  }

  // if the user already logged in, redirect them to the home page 👇
  if (
    type &&
    (currentUrl.startsWith("/login") || currentUrl.startsWith("/signup"))
  ) {
    return NextResponse.redirect(new URL(`/${type}/dashboard`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/patient/:path*",
    "/doctor/:path*",
    "/secretary/:path*",
    "/login",
    "/signup",
  ],
};

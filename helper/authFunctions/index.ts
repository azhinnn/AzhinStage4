import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcrypt";
import { redirect } from "next/navigation";

const COOCKIE_SECRET = process.env.COOCKIE_SECRET;

// hash the password (Genrate hashed password from password and salt) 👇
export async function hashPassword(password: string) {
  return await hash(password, 10);
}

export async function encryptToken(data: any) {
  return new SignJWT(data)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(new TextEncoder().encode(COOCKIE_SECRET));
}

export async function decryptToken(cookie: string) {
  try {
    const { payload } = await jwtVerify(
      cookie,
      new TextEncoder().encode(COOCKIE_SECRET),
      {
        algorithms: ["HS256"],
      }
    );

    return payload;
  } catch (error) {
    return null;
  }
}

export async function setUserCookie(data: any) {
  const token = await encryptToken(data);

  cookies().set("clincAuth", token, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function getUserCookie() {
  const cookie = await cookies().get("clincAuth")?.value;

  if (!cookie) redirect("/login");

  return await decryptToken(cookie);
}

export async function deleteUserCookie() {
  cookies().delete("clincAuth");
}

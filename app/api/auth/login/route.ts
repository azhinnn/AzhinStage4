import { setUserCookie } from "@/helper/authFunctions";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { compare } from "bcrypt";
import { sendVerifyEmail } from "@/helper/emailActions/sendVerifyEmail";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    let foundedUser = null;
    let foundPatient = null;
    let type = null;

    // check if user is patient
    foundPatient = await db.patient.findFirst({
      where: {
        OR: [
          {
            email: {
              equals: email,
            },
          },
          { phone: email },
        ],
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        hashedPassword: true,
        verified: true,
      },
    });
    if (foundPatient) type = "patient";

    foundedUser = foundPatient;

    // check if user is secretary
    if (!foundedUser) {
      foundedUser = await db.secretary.findFirst({
        where: {
          OR: [{ email: { equals: email } }, { phone: email }],
        },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          hashedPassword: true,
        },
      });
      type = "secretary";
    }
    // check if user is doctor
    if (!foundedUser) {
      foundedUser = await db.doctor.findFirst({
        where: {
          OR: [
            {
              email: {
                equals: email,
              },
            },
            { phone: email },
          ],
        },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          hashedPassword: true,
        },
      });
      type = "doctor";
    }
    // check if user is admin
    if (!foundedUser) {
      foundedUser = await db.admin.findFirst({
        where: {
          OR: [
            {
              email: {
                equals: email,
              },
            },
            { phone: email },
          ],
        },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          hashedPassword: true,
        },
      });
      type = "admin";
    }

    if (!foundedUser) {
      return NextResponse.json({
        error: "Invalid credentials",
        status: 404,
      });
    }

    const isPasswordValid = await compare(password, foundedUser.hashedPassword);

    if (!isPasswordValid) {
      return NextResponse.json({
        error: "Invalid credentials",
        status: 404,
      });
    }

    if (type === "patient" && !foundPatient?.verified && foundedUser.email) {
      await sendVerifyEmail({
        name: foundedUser.name,
        email: foundedUser.email,
      });

      return NextResponse.json({
        error: "Please verify your email",
        status: 401,
      });
    }

    await setUserCookie({
      id: foundedUser.id,
      name: foundedUser.name,
      email: foundedUser.email,
      image: foundedUser.image,
      type,
    });

    return NextResponse.json({ data: { type }, status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message, status: 500 });
  }
}

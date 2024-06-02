"use server";

import VerifyTemplate from "@/components/template/email/verify-template";
import { db } from "@/lib/db";
import { Resend } from "resend";
import { v4 as uuidv4 } from "uuid";

const RESEND_API_KEY = process.env.RESEND_API_KEY;

export async function sendVerifyEmail({
  name,
  email,
}: {
  name: string;
  email: string;
}) {
  try {
    const company = await db.company.findFirst();

    const token = uuidv4();

    const checkVerifyToken = await db.verifyToken.findFirst({
      where: {
        email,
      },
    });

    if (checkVerifyToken) {
      await db.verifyToken.deleteMany({
        where: {
          email,
        },
      });
    }

    await db.verifyToken.create({
      data: {
        email,
        token,
        expiredAt: new Date(Date.now() + 60 * 60 * 1000),
      },
    });

    const resend = new Resend(RESEND_API_KEY);

    const data = await resend.emails.send({
      from: "support@clinc.com",
      to: [email],
      subject: "Verify Email Address",
      react: VerifyTemplate({
        name,
        companyName: company?.name || "",
        companyImage: company?.image || "",
        token,
      }),
      text: "Verify Email Address",
    });

    return data;
  } catch (error: any) {
    return false;
  }
}

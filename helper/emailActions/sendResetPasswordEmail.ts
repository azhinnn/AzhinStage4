"use server";

import ResetPasswordTemplate from "@/components/template/email/reset-password-template";
import { db } from "@/lib/db";
import { Resend } from "resend";
import { v4 as uuidv4 } from "uuid";

const RESEND_API_KEY = process.env.RESEND_API_KEY;

export async function sendResetPasswordEmail(email: string) {
  try {
    const checkUser = await db.patient.findFirst({
      where: {
        email,
      },
    });

    if (!checkUser) {
      return { error: "User not found" };
    }

    const checkResetPasswordToken = await db.resetPasswordToken.findFirst({
      where: {
        email,
      },
    });

    if (checkResetPasswordToken) {
      await db.resetPasswordToken.deleteMany({
        where: {
          email,
        },
      });
    }

    const token = uuidv4();

    await db.resetPasswordToken.create({
      data: {
        email,
        token,
        expiredAt: new Date(Date.now() + 60 * 60 * 1000),
      },
    });

    const resend = new Resend(RESEND_API_KEY);
    const company = await db.company.findFirst();

    await resend.emails.send({
      from: "support@clinc.com",
      to: [email],
      subject: "Password Reset",
      react: ResetPasswordTemplate({
        name: checkUser.name,
        companyName: company?.name || "",
        companyImage: company?.image || "",
        token,
      }),
      text: "Password Reset",
    });

    return { success: "Password reset email sent!" };
  } catch (error) {
    return { error: "Something went wrong" };
  }
}

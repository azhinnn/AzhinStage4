"use server";

import { db } from "@/lib/db";
import { hashPassword } from "../authFunctions";

export async function resetPassword({
  email,
  token,
  password,
  confirmPassword,
}: {
  email: string;
  token: string;
  password: string;
  confirmPassword: string;
}) {
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
        token,
        expiredAt: {
          gte: new Date(),
        },
      },
    });

    if (!checkResetPasswordToken) {
      return { error: "Invalid token, please try again" };
    }

    if (password !== confirmPassword) {
      return { error: "Passwords do not match" };
    }

    const hashedPassword = await hashPassword(password);

    await db.patient.update({
      where: {
        id: checkUser.id,
        email,
      },
      data: {
        hashedPassword,
      },
    });

    await db.resetPasswordToken.deleteMany({
      where: {
        email,
      },
    });

    return { success: true };
  } catch (error) {
    return { error: "Something went wrong" };
  }
}

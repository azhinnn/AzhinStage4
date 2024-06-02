"use server";

import { db } from "@/lib/db";

export async function verifyEmail(token: string) {
  try {
    const findToken = await db.verifyToken.findFirst({
      where: {
        token,
        expiredAt: {
          gte: new Date(),
        },
      },
    });

    // const checkUser = await db.patient.findFirst({
    //   where: {
    //     email: findToken?.email,
    //     verified: null,
    //   },
    // });

    // if (!checkUser) {
    //   return null;
    // }

    // await db.patient.update({
    //   where: {
    //     id: checkUser.id,
    //   },
    //   data: {
    //     verified: new Date(),
    //   },
    // });

    return null;
  } catch (error) {
    return null;
  }
}

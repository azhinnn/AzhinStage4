import { deleteUserCookie } from "@/helper/authFunctions";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    // call delete cookie function
    await deleteUserCookie();
    return NextResponse.json({ status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message, status: 500 });
  }
}

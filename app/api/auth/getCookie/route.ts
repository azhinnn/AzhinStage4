import { getUserCookie } from "@/helper/authFunctions";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const data = await getUserCookie();
    return NextResponse.json({ data, status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message, status: 500 });
  }
}

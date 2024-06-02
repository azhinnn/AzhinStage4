import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { search } = await req.json();

    // Attempt to parse search as a number
    const searchNumber = Number(search);
    const isSearchNumber = !isNaN(searchNumber);

    const data = await db.appointment.findMany({
      where: {
        OR: [
          // Use the parsed number if search is a number, otherwise use undefin   ed
          {
            id: {
              equals:
                isSearchNumber && searchNumber < 2147483647
                  ? searchNumber
                  : undefined,
            },
          },
          {
            Patient: {
              OR: [
                {
                  name: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
                {
                  phone: {
                    contains: search.includes(" ")
                      ? search.split(" ").join("")
                      : search,
                  },
                },
                {
                  email: {
                    contains: search,
                  },
                },
              ],
            },
          },
        ],
      },
      include: {
        Doctor: true,
        Patient: {
          include: {
            City: true,
          },
        },
        DoctorType: {
          include: {
            DoctorField: true,
          },
        },
        Visit: true,
        Discount: true,
        Transaction: true,
      },
    });

    if (!data) {
      return NextResponse.json({ data: null, status: 404 });
    }

    return NextResponse.json({ data, status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message, status: 500 });
  }
}

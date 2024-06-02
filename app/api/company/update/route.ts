import { db } from "@/lib/db";
import { tz } from "moment-timezone";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { id, name, image, description } = await req.json();
    const checkCompany = await db.company.findFirst({
      where: {
        id: Number(id) || undefined,
      },
    });

    if (checkCompany) {
      const data = await db.company.update({
        where: {
          id: checkCompany.id,
        },
        data: {
          name: name || checkCompany.name,
          image: image || checkCompany.image,
          description: description || checkCompany.description,
          updatedAt: new Date(
            tz("Asia/Baghdad").format("YYYY-MM-DDTHH:mm:ss.SSS[Z]")
          ),
        },
      });
      return NextResponse.json({ data, status: 200 });
    }

    const data = await db.company.create({
      data: {
        name,
        image,
        description,
        createdAt: new Date(
          tz("Asia/Baghdad").format("YYYY-MM-DDTHH:mm:ss.SSS[Z]")
        ),
        updatedAt: new Date(
          tz("Asia/Baghdad").format("YYYY-MM-DDTHH:mm:ss.SSS[Z]")
        ),
      },
    });

    return NextResponse.json({ data, status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message, status: 500 });
  }
}

import "../globals.css";
import { getUserCookie } from "@/helper/authFunctions";
import { db } from "@/lib/db";
import UserHeader from "@/components/sidebar/userHeader";
import UserSidebar from "@/components/sidebar/userSidebar";
import { SecretarySections } from "@/components/data/sidebar-variants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Clinc",
  description: "Secretary - Clinc Managment System",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { id } = (await getUserCookie()) as any;
  const data = await db.secretary.findFirst({
    where: {
      id: Number(id),
    },
    select: {
      name: true,
      email: true,
      phone: true,
      image: true,
    },
  });

  const companyData = await db.company.findFirst({
    select: {
      id: true,
      name: true,
      description: true,
      image: true,
    },
  });

  return (
    <div className="md:flex w-full">
      <div className="md:hidden border-b sticky top-0 z-50 overflow-hidden">
        <UserHeader
          data={data}
          companyData={companyData}
          type="secretary"
          sections={SecretarySections}
        />
      </div>
      <div className="hidden md:block sticky top-0 min-w-72 max-w-72 border-r h-screen overflow-auto">
        <UserSidebar
          data={data || null}
          companyData={companyData || null}
          type="secretary"
          sections={SecretarySections}
        />
      </div>
      <div className="py-8 container overflow-auto">{children}</div>
    </div>
  );
}

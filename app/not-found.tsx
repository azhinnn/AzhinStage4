import Link from "next/link";
import { Button } from "@/components/ui/button";
import "./globals.css";
import Image from "next/image";
import logo from "@/public/logo.svg";
import confused from "@/public/confused.gif";
import { getCompany } from "@/helper/companyActions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Building2 } from "lucide-react";

export default async function NotFound() {
  const { data: company } = await getCompany();

  return (
    <main className="h-screen flex flex-col justify-between">
      <header className="flex justify-center items-center w-full h-24 border-b">
        <div className=" px-4">
          <Link href={"/"} className="flex flex-col items-center">
            <div className="flex items-center gap-2">
              <Avatar className={`w-14 h-14 ${company?.image && "shadow-lg"}`}>
                <AvatarImage src={company?.image || ""} />
                <AvatarFallback className="bg-gradient-to-r from-fuchsia-600 via-purple-600 to-sky-500">
                  <Building2 className="w-6 h-6 text-white" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-center text-2xl font-extrabold flex items-center gap-2">
                  {company?.name}
                </h1>
                <p className="text-xs hidden md:block">
                  {company?.description}
                </p>
              </div>
            </div>
          </Link>
        </div>
      </header>
      <section className="flex items-center justify-center gap-8">
        <Image
          loading="lazy"
          src={confused}
          width={400}
          height={400}
          alt="confused"
          className="rounded-xl w-1/3 hidden md:block"
        />
        <div className="flex flex-col items-center justify-center space-y-6">
          <h1 className="text-5xl font-bold text-muted-foreground">404</h1>
          <h2 className="text-3xl font-semibold text-gray-600">
            Whoopsie-doodle!
          </h2>
          <p className="max-w-md text-center text-gray-500">
            Our page has escaped to a parallel universe. We&apos;re sending
            intergalactic search parties, but until then, why not enjoy some
            cosmic memes while you wait?
          </p>
          <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
            <Button asChild className="px-16">
              <Link className="shadow" href="/">
                Home
              </Link>
            </Button>
          </div>
        </div>
      </section>
      <footer className="flex justify-center items-center w-full h-16 border-t">
        <p className="text-xs text-gray-600">
          © 2024 Clinc Managment System. All rights reserved.
        </p>
      </footer>
    </main>
  );
}

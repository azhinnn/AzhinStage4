import RootNavBar from "./navbar";
import { ThemeToggle } from "../theme/theme-toggle";
import Link from "next/link";
import { getCompany } from "@/helper/companyActions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Building2 } from "lucide-react";

export default async function Header() {
  const { data: company } = await getCompany();

  // const header = headers();
  return (
    <header className="px-4 lg:px-6 py-4 flex justify-between md:justify-around">
      <Link href={"/"} className="flex flex-col items-center">
        <div className="flex items-center gap-2">
          <Avatar className={`w-14 h-14 ${company?.image && "shadow-lg"}`}>
            <AvatarImage src={company?.image || ""} />
            <AvatarFallback
              className={`${
                !company?.image &&
                "bg-gradient-to-r from-fuchsia-600 via-purple-600 to-sky-500"
              }`}>
              <Building2 className="w-6 h-6 text-white" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-center text-2xl font-extrabold flex items-center gap-2">
              {company?.name}
            </h1>
            <p className="text-xs hidden md:block">{company?.description}</p>
          </div>
        </div>
      </Link>
      <div className="flex items-center gap-4 md:gap-10 justify-between">
        <ThemeToggle />
        <RootNavBar />
      </div>
    </header>
  );
}

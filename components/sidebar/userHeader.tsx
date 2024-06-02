"use client";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AlignRight, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { UserMenuSchema } from "@/components/schemas/user-menu-schema";
import { SidebarLogoSchema } from "@/components/schemas/sidebar-logo-schema";
import UserSidebar from "./userSidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function UserHeader({
  data,
  companyData,
  type,
  sections,
}: {
  data: UserMenuSchema;
  companyData: SidebarLogoSchema;
  type: string;
  sections: { name: string; icon: string }[];
}) {
  const [isOpen, setIsOpen] = useState(false);

  function closeSheet() {
    setIsOpen(false);
  }

  return (
    <div className="container py-4 flex items-center justify-between backdrop-blur">
      <Avatar className={`w-14 h-14 ${!companyData?.image && "shadow-lg"}`}>
        <AvatarImage src={companyData?.image || ""} />
        <AvatarFallback
          className={`${
            !companyData?.image &&
            "bg-gradient-to-r from-fuchsia-600 via-purple-600 to-sky-500"
          }`}>
          <Building2 className="w-6 h-6 text-white" />
        </AvatarFallback>
      </Avatar>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger>
          <Button asChild className="aspect-square h-10 w-10 p-[.6rem]">
            <AlignRight className="w-10 h-10 text-lg" />
          </Button>
        </SheetTrigger>
        <SheetContent side={"left"} className="px-0 overflow-y-auto">
          <UserSidebar
            onClick={closeSheet}
            data={data}
            companyData={companyData}
            sections={sections}
            type={type}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
}

"use client";
import UserSections from "./userSections";
import LogOutBtn from "@/components/auth/logout";
import UserMenu from "./userMenu";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { UserMenuSchema } from "@/components/schemas/user-menu-schema";
import SidebarLogo from "@/components/sidebar/userSidebarLogo";
import { SidebarLogoSchema } from "@/components/schemas/sidebar-logo-schema";

export default function UserSidebar({
  onClick,
  data,
  companyData,
  type,
  sections,
}: {
  onClick?: () => void;
  data: UserMenuSchema;
  companyData: SidebarLogoSchema;
  type: string;
  sections: { name: string; icon: string }[];
}) {
  return (
    <div className="sticky top-0 flex w-full flex-col border-l py-5 overflow-y-auto gap-4 px-4 min-w-max">
      {/* logo */}
      <SidebarLogo data={companyData} type={type} onClick={onClick} />
      <Separator className="my-1" />

      {/* menu */}
      <div className="flex w-full items-center justify-between">
        <UserMenu onClick={onClick || (() => {})} data={data} type={type} />
        <ThemeToggle />
      </div>

      {/* Sections */}
      <UserSections
        onClick={onClick || (() => {})}
        sections={sections}
        type={type}
      />

      {/* log out btn */}
      <LogOutBtn />
    </div>
  );
}

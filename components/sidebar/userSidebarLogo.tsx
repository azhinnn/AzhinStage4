import { SidebarLogoSchema } from "../schemas/sidebar-logo-schema";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Building2, LineChartIcon, Settings } from "lucide-react";

export default function SidebarLogo({
  data,
  type,
  onClick,
}: {
  data: SidebarLogoSchema;
  type: string;
  onClick?: () => void;
}) {
  return (
    <div className="flex items-center gap-3">
      {type === "admin" ? (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar className={`w-14 h-14 shadow-lg `}>
              <AvatarImage src={data?.image || ""} />
              <AvatarFallback className="bg-gradient-to-r from-fuchsia-600 via-purple-600 to-sky-500">
                <Building2 className="w-6 h-6 text-white" />
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{data?.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {data?.description}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem asChild>
              <Link
                href={`/${type}/analytics`}
                className="cursor-pointer"
                onClick={onClick}>
                Analytics
                <DropdownMenuShortcut>
                  <LineChartIcon className="mr-2 h-4 w-4" />
                </DropdownMenuShortcut>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href={`/${type}/settings`}
                className="cursor-pointer"
                onClick={onClick}>
                Settings
                <DropdownMenuShortcut>
                  <Settings className="mr-2 h-4 w-4" />
                </DropdownMenuShortcut>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Avatar className={`w-14 h-14 shadow-lg `}>
          <AvatarImage src={data?.image || ""} />
          <AvatarFallback
            className={`${
              !data?.image &&
              "bg-gradient-to-r from-fuchsia-600 via-purple-600 to-sky-500"
            }`}>
            <Building2 className="w-6 h-6 text-white" />
          </AvatarFallback>
        </Avatar>
      )}
      <div className="max-w-44">
        <h1 className="text-2xl font-extrabold truncate">
          {data?.name || "No Name"}
        </h1>
        <p className="text-xs truncate">
          {data?.description || "No Description"}
        </p>
      </div>
    </div>
  );
}

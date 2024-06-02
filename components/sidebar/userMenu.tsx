"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Shield, UserRoundCog } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { UserMenuSchema } from "@/components/schemas/user-menu-schema";
import { Icon } from "@iconify/react/dist/iconify.js";
import { UserTypeIcon } from "../data/sidebar-variants";

export default function UserMenu({
  onClick,
  data,
  type,
}: {
  onClick?: () => void;
  data: UserMenuSchema;
  type: string;
}) {
  return (
    <div className="flex items-center gap-4 ml-2">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar className="h-12 w-12 shadow-lg shadow-green-500/50">
            <AvatarImage src={data?.image || ""} alt={data?.name} />
            <AvatarFallback>{data?.name.charAt(0)}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{data?.name}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {data?.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem asChild>
            <Link
              href={`/${type}/account`}
              className="cursor-pointer"
              onClick={onClick}>
              Account Settings
              <DropdownMenuShortcut>
                <UserRoundCog className="mr-2 h-4 w-4" />
              </DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <div>
        <h1 className="text-xl font-bold">{data?.name?.split(" ")[0]}</h1>
        <Badge
          variant={"destructive"}
          className="text-[.6rem] flex items-center mt-1 w-fit max-w-max">
          <Icon
            icon={
              UserTypeIcon.find((icon: any) => icon.type === type)?.icon || ""
            }
            className="h-3.5 w-3.5 mr-1"
          />{" "}
          {type.toUpperCase()}
        </Badge>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { Icon } from "@iconify/react";

export default function UserSections({
  onClick,
  sections,
  type,
}: {
  onClick?: () => void;
  sections: { name: string; icon: string }[];
  type: string;
}) {
  const pathname = usePathname();

  return (
    <div className="grid w-full items-start">
      {sections.map((section) => (
        <Button
          asChild
          key={section.name}
          variant={"ghost"}
          className="justify-start gap-3"
          onClick={onClick}>
          <Link
            className={
              pathname.includes(section.name.toLocaleLowerCase())
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-muted"
            }
            href={`/${type}/${section.name}`}>
            <Icon icon={section.icon} className="h-4 w-4" />
            {section.name.toLocaleUpperCase().charAt(0) + section.name.slice(1)}
          </Link>
        </Button>
      ))}
    </div>
  );
}

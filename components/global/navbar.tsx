"use client";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { AlignRight } from "lucide-react";
import { useState } from "react";

export default function RootNavBar() {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = (section: string) => {
    setTimeout(() => {
      window.location.hash = section; // Navigate to #services
    }, 300);
    setIsOpen(false);
  };

  return (
    <>
      {/* Desktop 👇 */}
      <nav className="gap-4 hidden md:flex text-sm min-w-max">
        <Sections />
      </nav>
      {/* Mobile 👇 */}
      <nav className="gap-4 flex md:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger className="md:hidden" asChild>
            <Button className="w-10 h-10 p-[.6rem]">
              <AlignRight className="w-10 h-10 text-lg" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
              <SheetDescription>Lets take a look around!</SheetDescription>
            </SheetHeader>

            <SheetFooter className="flex flex-col gap-2 pt-8">
              <Button asChild variant={"ghost"}>
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild variant={"ghost"}>
                <Link href="/signup">Sign Up</Link>
              </Button>
              <Button onClick={() => handleClick("services")} variant={"ghost"}>
                Service
              </Button>
              <Button onClick={() => handleClick("doctors")} variant={"ghost"}>
                Doctors
              </Button>
              <Button onClick={() => handleClick("contact")} variant={"ghost"}>
                Contact
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </nav>
    </>
  );
}

function Sections() {
  return (
    <>
      <Link
        className="font-medium hover:underline underline-offset-4"
        href="/login">
        Login
      </Link>
      <Link
        className="font-medium hover:underline underline-offset-4"
        href="/signup">
        Sign Up
      </Link>
      <Link
        className="font-medium hover:underline underline-offset-4"
        href="#services">
        Services
      </Link>
      <Link className="font-medium hover:underline underline-offset-4" href="#">
        Doctors
      </Link>
      <Link className="font-medium hover:underline underline-offset-4" href="#">
        Contact
      </Link>
    </>
  );
}

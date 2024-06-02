"use client";
import { Button } from "@/components/ui/button";
import { verifyEmail } from "@/helper/emailActions/verifyEmail";
import { Loader, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function Page() {
  const params = useSearchParams().get("token");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  if (!params) router.push("/login");

  async function onClick() {
    setIsLoading(true);

    const res = await verifyEmail(params!);
    if (!res) {
      setResult("Failed to verify email");
      setIsLoading(false);
      return;
    }
    setResult("Email verified successfully");

    setIsLoading(false);
  }

  return (
    <>
      {!result && defaultVerifyEmail({ onClick, isLoading })}
      {result === "Email verified successfully" && successVerifyEmail()}
      {result === "Failed to verify email" && failedVerifyEmail()}
    </>
  );
}

function defaultVerifyEmail({
  onClick,
  isLoading,
}: {
  onClick: () => void;
  isLoading: boolean;
}) {
  return (
    <section className="flex flex-col items-center justify-center space-y-4 h-full">
      <Mail className="h-20 w-20" />
      <h1 className="text-3xl font-bold">Verify your Email!</h1>
      <p className="text-center px-4 text-muted-foreground">
        Plese click the button below to verify your email.
      </p>
      <Button className="w-60" onClick={onClick}>
        {isLoading ? (
          <Loader className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          "Verify"
        )}
      </Button>
      <p className="text-sm text-center px-4 mt-10 text-muted-foreground">
        If you did not request this verification, please ignore this email or
        contact us for account safety concerns.
      </p>
    </section>
  );
}

function successVerifyEmail() {
  return (
    <section className="flex flex-col items-center justify-center space-y-4 h-full">
      <Mail className="h-20 w-20" />
      <h1 className="text-3xl font-bold">Email verified!</h1>
      <p className="text-center px-4 text-muted-foreground">
        Email verified successfully. You can now login.
      </p>
      <Button className="w-60" asChild>
        <Link href={"/login"}>Login</Link>
      </Button>
    </section>
  );
}

function failedVerifyEmail() {
  return (
    <section className="flex flex-col items-center justify-center space-y-4 h-full">
      <Mail className="h-20 w-20" />
      <h1 className="text-3xl font-bold">Failed to verify email!</h1>
      <p className="text-center px-4 text-muted-foreground">
        Failed to verify email. Please try again.
      </p>
      <Button className="w-60" asChild>
        <Link href={"/login"}>Login</Link>
      </Button>
    </section>
  );
}

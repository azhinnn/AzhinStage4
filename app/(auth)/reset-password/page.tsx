import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import ResetPasswordForm from "./_form/ResetPasswordForm";

export default async function Page(params: any) {
  const searchParams = params.searchParams;

  if (!searchParams?.token) redirect("/login");

  const token = await db.resetPasswordToken.findFirst({
    where: {
      token: searchParams.token,
    },
  });

  if (!token) redirect("/login");

  const email = token?.email;

  if (!email) redirect("/login");

  return (
    <div>
      <ResetPasswordForm email={token.email} token={token.token} />
    </div>
  );
}

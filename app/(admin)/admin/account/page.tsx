import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import ChangeAdminDetailForm from "./_forms/change-detail-form";
import { db } from "@/lib/db";
import { getUserCookie } from "@/helper/authFunctions";
import ChangeAdminPasswordForm from "./_forms/change-password-form";
import ChangeAdminImage from "./_forms/change-image";

export default async function Page() {
  const { id } = (await getUserCookie()) as any;

  const data = await db.admin.findUnique({
    where: {
      id: Number(id),
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      image: true,
    },
  });
  return (
    <div className="grid gap-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Account</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <ChangeAdminImage data={data} />
      <ChangeAdminDetailForm data={data} />
      <ChangeAdminPasswordForm data={data} />
    </div>
  );
}

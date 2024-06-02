import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import ChangePatientDetailForm from "./forms/change-detail-form";
import { db } from "@/lib/db";
import { getUserCookie } from "@/helper/authFunctions";
import ChangePatientPasswordForm from "./forms/change-password-form";
import { getCities } from "@/helper/cityActions";

export default async function Page() {
  const { id } = (await getUserCookie()) as any;

  const data = await db.patient.findUnique({
    where: {
      id: Number(id),
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      City: true,
      street: true,
      gender: true,
      age: true,
    },
  });

  const { data: cities } = await getCities();

  return (
    <div className="grid gap-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/patient/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Account</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <ChangePatientDetailForm data={data} cities={cities} />

      <ChangePatientPasswordForm data={data} />
    </div>
  );
}

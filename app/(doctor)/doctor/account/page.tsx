import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import ChangeDoctorDetailForm from "./_forms/change-detail-form";
import { db } from "@/lib/db";
import { getUserCookie } from "@/helper/authFunctions";
import ChangeDoctorPasswordForm from "./_forms/change-password-form";
import ChangeDoctorImage from "./_forms/change-image";
import { getCities } from "@/helper/cityActions";

export default async function Page() {
  const { id } = (await getUserCookie()) as any;

  const data = await db.doctor.findUnique({
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
      image: true,
    },
  });

  const { data: cities } = await getCities();
  return (
    <div className="grid gap-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/doctor/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Account</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <ChangeDoctorImage data={data} />
      <ChangeDoctorDetailForm data={data} cities={cities} />

      <ChangeDoctorPasswordForm data={data} />
    </div>
  );
}

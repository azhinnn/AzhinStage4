import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getCompany } from "@/helper/companyActions";
import ChangeCompanyDetailForm from "./_forms/change-detail-form";
import ChangeCompanyImage from "./_forms/change-image";
import { DataTable } from "@/components/myTableComponent/data-table";
import { columns } from "./_cityTable/columns";
import { getCities } from "@/helper/cityActions";
import { MapPin, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import AddCityDialog from "./_forms/add-city-dialog";

export default async function Page() {
  const data = await getCompany();
  const { data: cityData } = await getCities();
  return (
    <div className="space-y-10">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Settings</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <ChangeCompanyImage data={data?.data || {}} />
      <ChangeCompanyDetailForm data={data?.data || {}} />

      <Separator />
      <div className="space-y-8">
        <div className="flex justify-between ">
          <h1 className="font-bold text-3xl flex items-center gap-2">
            <MapPin className="w-8 h-8" /> Cities
          </h1>
          <AddCityDialog />
        </div>
        {/* City Table 👇 */}
        <DataTable data={cityData || []} columns={columns} />
      </div>
    </div>
  );
}

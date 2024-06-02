import { DataTable } from "@/components/myTableComponent/data-table";
import { getWaitings } from "@/helper/waitingActions";
import { columns } from "./_waitingTable/components/columns";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Circle } from "lucide-react";

export default async function Page() {
  const { data } = await getWaitings();
  data?.forEach((item: any) => {
    item.name = item.Patient.name;
    item.phone = item.Patient.phone;
  });

  return (
    <div className="lg:space-y-4 space-y-12">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/appointments">
              Appointments
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Waiting</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="font-bold text-3xl flex items-center gap-2 flex-wrap">
        <h1 className="flex gap-2 items-start">
          <Circle className="w-8 h-8" />
          Waiting
        </h1>
      </div>

      <DataTable data={data || []} columns={columns} />
    </div>
  );
}

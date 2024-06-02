import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CalendarClock,
  Circle,
  FolderPlus,
  Microscope,
  Stethoscope,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getUserCookie } from "@/helper/authFunctions";
import { db } from "@/lib/db";
import { utc } from "moment";
import { waitingStatus } from "@/components/myTableComponent/data";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default async function Page() {
  const { id } = (await getUserCookie()) as any;

  const data = await db.waiting.findMany({
    where: {
      patientId: Number(id),
    },
    select: {
      id: true,
      status: true,
      createdAt: true,
      Doctor: {
        select: {
          name: true,
          image: true,
        },
      },
      DoctorType: {
        select: {
          name: true,
        },
      },
      DoctorField: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/patient/appointments">
              Appointments
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Pending</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <h1 className="font-bold text-3xl flex items-start gap-2">
        <Circle className="w-8 h-8 drop-shadow-md" /> Pending
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {data.length > 0 ? (
          data.map((data) => <WaitingCard key={data.id} data={data} />)
        ) : (
          <Card className="text-center text-muted-foreground md:col-span-2">
            <CardHeader>
              <CardTitle>No Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <p>No Pending Appointments</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

type badgeType = "success" | "warning" | "destructive";

function WaitingCard({ data }: any) {
  const statusType = [
    {
      status: "pending",
      variant: "warning",
    },
    {
      status: "accepted",
      variant: "success",
    },
    {
      status: "rejected",
      variant: "destructive",
    },
  ];

  return (
    <Card>
      <CardHeader className="flex-row gap-4 items-center">
        <Avatar>
          <AvatarImage src={data?.Doctor?.image || ""} />
          <AvatarFallback>{data?.Doctor.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <CardTitle>{data?.Doctor.name}</CardTitle>
          <CardDescription className="flex items-center gap-1">
            <Stethoscope className="w-3 h-3" /> Doctor
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex justify-between items-center gap-3 flex-wrap">
        <div className="space-y-1">
          <p className=" flex items-center gap-2">
            <FolderPlus className="w-4 h-4" />
            {data?.DoctorField.name}
          </p>
          <p className=" flex items-center gap-2">
            <Microscope className="w-4 h-4" />
            {data?.DoctorType.name}
          </p>
          <p className="flex items-center gap-2">
            <CalendarClock className="w-4 h-4" />
            {utc(data?.createdAt).format("DD/MM/YYYY - hh:mm A")}
          </p>
        </div>
        <div>
          <Badge
            variant={
              statusType.find((type) => type.status === data?.status)
                ?.variant as badgeType
            }>
            {waitingStatus.find((type) => type.value === data?.status)?.label}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

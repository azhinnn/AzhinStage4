import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Contact2Icon, Mail, Phone } from "lucide-react";
import { getSecretaries } from "@/helper/secretaryActions";

export default async function Page() {
  const { data: secretaries } = (await getSecretaries()) || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {secretaries.length > 0 ? (
        secretaries?.map((data: any, index: number) => (
          <ContactCard key={index} data={data} />
        ))
      ) : (
        <Card className="text-center text-muted-foreground md:col-span-2">
          <CardHeader>
            <CardTitle>No Secretaries</CardTitle>
          </CardHeader>
          <CardContent>
            <p>No secretaries found</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function ContactCard({ data }: any) {
  return (
    <Card className="drop-shadow-md min-w-fit hover:bg-card/80 transition-colors">
      <CardHeader className="sm:flex-row sm:justify-between items-start sm:items-center gap-4">
        <CardTitle className="flex items-center gap-3">
          <Avatar className="w-14 h-14">
            <AvatarImage src={data?.image || ""} className="object-cover" />
            <AvatarFallback>{data?.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="space-y-2">
            <b>{data?.name}</b>

            <Badge className="flex gap-1 items-center ">
              <Contact2Icon className="w-3 h-3 mr-1" />
              Secretary
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-muted-foreground">
        <p className=" flex items-center gap-2">
          <Phone className="w-4 h-4" />
          {data?.phone}
        </p>
        <p className=" flex items-center gap-2">
          <Mail className="w-4 h-4" />
          {data?.email}
        </p>
      </CardContent>
    </Card>
  );
}

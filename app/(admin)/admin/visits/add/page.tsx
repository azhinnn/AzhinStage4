"use client";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useEffect, useState } from "react";
import { Loader } from "lucide-react";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import {
  getAppointment,
  getAppointmentByPhoneNID,
} from "@/helper/appointmentActions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { addNextVisit, getVisitByDoctorNType } from "@/helper/visitActoins";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { visitStatus } from "@/components/myTableComponent/data";
import { utc } from "moment";

const visitFormSchema = z.object({
  appointmentId: z.number(),
  pName: z.string().min(2).max(50),
  pPhone: z.string().min(0),
  pEmail: z.string(),
  pGender: z.string(),
  pAge: z.number(),
  pCity: z.string().min(2).max(50).nullable().optional(),
  pStreet: z.string().min(2).max(50).nullable().optional(),
  dName: z.string(),
  dPhone: z.string(),
  dEmail: z.string().nullable().optional(),
  fName: z.string(),
  tName: z.string(),
  nextVisitDate: z.string(),
});

const searchSchema = z.object({
  search: z.string().min(1).max(50),
});

export default function Page() {
  const router = useRouter();
  const params = useSearchParams().get("id");

  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isSelected, setIsSelected] = useState(params ? true : false);
  const [appointments, setAppointments] = useState<any[] | null>(null);
  const [visitTimes, setVisitTimes] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      if (params) {
        const { data: appointment } = await getAppointment({
          id: params,
        });

        form.reset({
          appointmentId: appointment.id,
          pName: appointment.Patient.name,
          pPhone: appointment.Patient.phone,
          pEmail: appointment.Patient.email,
          pGender: appointment.Patient.gender,
          pAge: appointment.Patient.age,
          pCity: appointment.Patient.City.name,
          pStreet: appointment.Patient.street,
          dName: appointment.Doctor.name,
          dPhone: appointment.Doctor.phone,
          dEmail: appointment.Doctor.email,
          fName: appointment.DoctorType.DoctorField.name,
          tName: appointment.DoctorType.name,
          nextVisitDate: new Date(
            new Date().getTime() - new Date().getTimezoneOffset() * 60000
          )
            .toISOString()
            .slice(0, 16),
        });

        await getNewVisitTimes({
          doctorId: appointment.Doctor.id,
          doctorTypeId: appointment.DoctorType.id,
        });
      }
      setIsLoading(false);
    }
    fetchData();
  }, [params]);

  const form = useForm<z.infer<typeof visitFormSchema>>({
    resolver: zodResolver(visitFormSchema),
    defaultValues: {
      nextVisitDate: utc(new Date()).format("DD/MM/YYYY hh:mm A"),
    },
  });

  const searchForm = useForm<z.infer<typeof searchSchema>>({
    resolver: zodResolver(searchSchema),
  });

  async function onSubmit(values: z.infer<typeof visitFormSchema>) {
    setIsAdding(true);

    const res = await addNextVisit({ data: values });

    if (res.status === 409) {
      toast.error("Appointment Completed!", {
        description: (
          <div className="dark:text-white">
            Appointment is already done, Please add new Appointment.
          </div>
        ),
      });
      setIsAdding(false);
      return;
    }
    if (res.status !== 200) {
      toast.error("Something went wrong");
      setIsAdding(false);
      return;
    }
    toast.success("visit added successfully");
    router.push("/admin/visits");
  }

  async function onSearch(values: z.infer<typeof searchSchema>) {
    const data = await getAppointmentByPhoneNID(values);

    if (data.status === 404 || data.data?.length === 0) {
      setAppointments(null);
      toast.error("Appointment not found");
      return;
    }

    if (data.status === 500) {
      toast.error("Something went wrong");
      return;
    }

    setAppointments(data.data);
  }

  function onSelect(appointment: any) {
    form.reset({
      appointmentId: appointment.id,
      pName: appointment.Patient.name,
      pPhone: appointment.Patient.phone,
      pEmail: appointment.Patient.email,
      pGender: appointment.Patient.gender,
      pAge: appointment.Patient.age,
      pCity: appointment.Patient.City.name,
      pStreet: appointment.Patient.street,
      dName: appointment.Doctor.name,
      dPhone: appointment.Doctor.phone,
      dEmail: appointment.Doctor.email,
      fName: appointment.DoctorType.DoctorField.name,
      tName: appointment.DoctorType.name,
      nextVisitDate: new Date(
        new Date().getTime() - new Date().getTimezoneOffset() * 60000
      )
        .toISOString()
        .slice(0, 16),
    });

    getNewVisitTimes({
      doctorId: appointment.Doctor.id,
      doctorTypeId: appointment.DoctorType.id,
    });
    setIsSelected(true);
  }

  async function getNewVisitTimes({ doctorId, doctorTypeId }: any) {
    const { data } = await getVisitByDoctorNType({
      data: { doctorId, doctorTypeId },
    });

    setVisitTimes(data);
  }

  return isLoading ? (
    <div className="container h-full flex items-center justify-center">
      <Loader className="w-5 h-5 animate-spin" />
    </div>
  ) : (
    <div className="space-y-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/visits">Visits</BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Add Visit</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card>
        <CardHeader>
          <CardTitle>
            Add Visit for Appointment {form.getValues("appointmentId")}
          </CardTitle>
          <CardDescription>Add visit for an Appointment.</CardDescription>
        </CardHeader>
        {!isSelected ? (
          <>
            <Form {...searchForm}>
              <form
                onSubmit={searchForm.handleSubmit(onSearch)}
                className="space-y-6">
                <CardContent className="space-y-4">
                  <FormField
                    control={searchForm.control}
                    name="search"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Search for Appointment</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Search for Appointment"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          You can search for Appointment by Patient{" "}
                          <b>Full Name</b>, <b>Email</b> or <b>Phone</b> or{" "}
                          <b>Appointment ID</b>.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit">Search</Button>
                </CardContent>
              </form>
            </Form>
            <Separator className="mb-4" />
            {appointments && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>App ID</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Patient Phone</TableHead>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Field</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Appointment Status</TableHead>
                    <TableHead>Select</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {appointments.map((appointment: any) => (
                    <TableRow key={appointment.id}>
                      <>
                        <TableCell>{appointment.id}</TableCell>
                        <TableCell>{appointment.Patient.name}</TableCell>
                        <TableCell>{appointment.Patient.phone}</TableCell>
                        <TableCell>{appointment.Doctor.name}</TableCell>
                        <TableCell>
                          {appointment.DoctorType.DoctorField.name}
                        </TableCell>
                        <TableCell>{appointment.DoctorType.name}</TableCell>
                        <TableCell>
                          {
                            visitStatus.find(
                              (status) => status.value === appointment.status
                            )?.label
                          }
                        </TableCell>
                        <TableCell>
                          {appointment.status === "completed" ? (
                            <TooltipProvider>
                              <Tooltip delayDuration={0}>
                                <TooltipTrigger>
                                  <Button disabled>Select</Button>
                                </TooltipTrigger>
                                <TooltipContent className="text-center">
                                  <b>Appointment is already Completed!</b>
                                  <p>Please add new appointment.</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          ) : (
                            <Button onClick={() => onSelect(appointment)}>
                              Select
                            </Button>
                          )}
                        </TableCell>
                      </>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <CardContent className="space-y-4">
                <div className="grid lg:grid-cols-3 items-center gap-2 lg:gap-4">
                  <FormField
                    disabled={isAdding}
                    control={form.control}
                    name="pName"
                    render={({ field }) => (
                      <FormItem className="w-full ">
                        <FormLabel>Patient Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter patient name"
                            {...field}
                            readOnly
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    disabled={isAdding}
                    control={form.control}
                    name="pPhone"
                    render={({ field }) => (
                      <FormItem className="w-full ">
                        <FormLabel>Patient Phone</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter patient phone"
                            {...field}
                            readOnly
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    disabled={isAdding}
                    control={form.control}
                    name="pEmail"
                    render={({ field }) => (
                      <FormItem className="w-full ">
                        <FormLabel>Patient Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter patient email"
                            {...field}
                            readOnly
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid lg:grid-cols-4 items-center gap-2 lg:gap-4">
                  <FormField
                    disabled={isAdding}
                    control={form.control}
                    name="pAge"
                    render={({ field }) => (
                      <FormItem className="w-full ">
                        <FormLabel>Patient Age</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter patient Age"
                            {...field}
                            readOnly
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    disabled={isAdding}
                    control={form.control}
                    name="pGender"
                    render={({ field }) => (
                      <FormItem className="w-full ">
                        <FormLabel>Patient Gender</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter patient gender"
                            {...field}
                            readOnly
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    disabled={isAdding}
                    control={form.control}
                    name="pCity"
                    render={({ field }) => (
                      <FormItem className="w-full ">
                        <FormLabel>Patient City</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter patient city"
                            {...field}
                            readOnly
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    disabled={isAdding}
                    control={form.control}
                    name="pStreet"
                    render={({ field }) => (
                      <FormItem className="w-full ">
                        <FormLabel>Patient Street</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter patient street"
                            {...field}
                            readOnly
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Separator />
                <div className="grid lg:grid-cols-2 gap-2 lg:gap-4 w-full">
                  <div className="grid gap-2 lg:gap-4">
                    <FormField
                      disabled={isAdding}
                      control={form.control}
                      name="dName"
                      render={({ field }) => (
                        <FormItem className="w-full ">
                          <FormLabel>Doctor Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter doctor name"
                              {...field}
                              readOnly
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      disabled={isAdding}
                      control={form.control}
                      name="fName"
                      render={({ field }) => (
                        <FormItem className="w-full ">
                          <FormLabel>Field</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter field name"
                              {...field}
                              readOnly
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      disabled={isAdding}
                      control={form.control}
                      name="tName"
                      render={({ field }) => (
                        <FormItem className="w-full ">
                          <FormLabel>Type</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter Type name"
                              {...field}
                              readOnly
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="space-y-2 bg-gray-200 dark:bg-slate-800 my-2 lg:my-0 p-4 rounded">
                      <FormField
                        disabled={isAdding}
                        control={form.control}
                        name="nextVisitDate"
                        render={({ field }) => (
                          <FormItem className="w-fit">
                            <FormLabel>Visit Date</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter Visit Date"
                                {...field}
                                type="datetime-local"
                                min={new Date().toISOString().slice(0, 16)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <Card>
                    <CardHeader className="text-center">
                      <CardTitle>Taken Date(s)</CardTitle>
                      <CardDescription>
                        You can check the date and time of visits that are
                        already taken.
                      </CardDescription>
                    </CardHeader>
                    <Separator />
                    <CardContent>
                      <ScrollArea className="h-[300px]">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Patient</TableHead>
                              <TableHead className="text-right">
                                Visit Time
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {visitTimes?.length ? (
                              visitTimes?.map((visitTime: any) => (
                                <TableRow key={visitTime.id}>
                                  <TableCell>
                                    {visitTime.Appointment.Patient.name}
                                  </TableCell>
                                  <TableCell className="text-right">
                                    {utc(new Date(visitTime?.date)).format(
                                      "DD/MM/YYYY - hh:mm A"
                                    )}
                                  </TableCell>
                                </TableRow>
                              ))
                            ) : (
                              <TableRow>
                                <TableCell
                                  colSpan={2}
                                  className="h-24 text-center">
                                  No results.
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isAdding} className="w-full">
                  {isAdding ? (
                    <Loader className="w-5 h-5 animate-spin" />
                  ) : (
                    "Add Visit"
                  )}
                </Button>
              </CardFooter>
            </form>
          </Form>
        )}
      </Card>
    </div>
  );
}

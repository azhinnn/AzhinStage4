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
import { useRouter } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { getDoctorTypeList } from "@/helper/doctorTypeActions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getDoctorFields } from "@/helper/doctorFieldActions";
import Link from "next/link";
import { GetDoctorListByType } from "@/helper/doctorActions";
import { addAppointment } from "@/helper/appointmentActions";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getPatientList } from "@/helper/patientActions";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getVisitByDoctorNType } from "@/helper/visitActoins";
import { utc } from "moment";
import { getCities } from "@/helper/cityActions";

const appointmentFormSchema = z
  .object({
    patientName: z.string().min(2).max(50),
    patientPhone: z
      .string()
      .min(11)
      .max(11)
      .refine((value) => /^(075|077|078)\d{8}$/.test(value), {
        message: "Phone number must start with 075, 077, or 078.",
      }),
    patientEmail: z.string().email().optional().nullable().or(z.literal("")),
    patientGender: z.string(),
    patientAge: z.string(),
    patientCity: z.string().optional().nullable(),
    patientStreet: z.string().optional().nullable(),
    doctorFieldId: z.string({ required_error: "doctor field is required" }),
    doctorTypeId: z.string({ required_error: "doctor type is required" }),
    doctorId: z.string({ required_error: "doctor is required" }),
    patientId: z.string().optional(),
    visitDate: z.string(),
  })
  .refine((data) => Number(data.patientAge) <= 120, {
    message: "Age must be less than or equal to 120",
    path: ["age"],
  });

const searchSchema = z.object({
  search: z.string().min(1).max(50),
});

export default function Page() {
  const [cities, setCities] = useState([]);
  const [isNewPatient, setIsNewPatient] = useState(true);
  const [isSelected, setIsSelected] = useState(false);
  const [searchResult, setSearchResult] = useState<any[]>([]);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [doctorFields, setDoctorFields] = useState<any[]>([]);
  const [doctorTypes, setDoctorTypes] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [visitTimes, setVisitTimes] = useState<
    | {
        id: number;
        date: string;
        Appointment: {
          Patient: {
            name: string;
          };
        };
      }[]
    | null
  >(null);

  const form = useForm<z.infer<typeof appointmentFormSchema>>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      visitDate: new Date(
        new Date().getTime() - new Date().getTimezoneOffset() * 60000
      )
        .toISOString()
        .slice(0, 16),
    },
  });

  const searchForm = useForm<z.infer<typeof searchSchema>>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      search: "",
    },
  });

  // get doctor fields when page loads 👇
  useEffect(() => {
    async function fetchData() {
      const { data: doctorFields } = await getDoctorFields();

      const FieldsWithDoctorAndTypes = doctorFields?.filter(
        (item: any) => item._count.DoctorType > 0 && item._count.Doctor > 0
      );

      setDoctorFields(FieldsWithDoctorAndTypes);

      // get cities
      const { data: cities } = await getCities();
      setCities(cities);
    }

    fetchData();
  }, []);

  // get new doctor types when doctor field changes 👇
  async function getNewTypes(doctorFieldId: string) {
    const { data } = await getDoctorTypeList(doctorFieldId);

    const TypesWithDoctor = data?.filter(
      (item: any) => item.Doctor?.length > 0
    );

    TypesWithDoctor?.forEach((type: any) => {
      type.id = type.id.toString();
    });

    setDoctorTypes(TypesWithDoctor);
  }

  // get new doctors when doctor type changes 👇
  async function getNewDoctors(doctorTypeId: string) {
    const { data } = await GetDoctorListByType(doctorTypeId);

    data?.forEach((type: any) => {
      type.id = type.id.toString();
    });

    setDoctors(data);
  }

  // get new visit times when doctor or doctor type changes 👇
  async function getNewVisitTimes({ doctorId, doctorTypeId }: any) {
    const { data } = await getVisitByDoctorNType({
      data: { doctorId, doctorTypeId },
    });

    setVisitTimes(data);
  }

  // submit the form data to the databse and recive the response 👇
  async function onSubmit(values: z.infer<typeof appointmentFormSchema>) {
    setIsLoading(true);

    const res = await addAppointment(values);

    if (res.status === 409) {
      if (res.errorType === "phoneOrEmailAlreadyExists") {
        toast.error("Patient already exist!", {
          description: (
            <div className="dark:text-white">
              Patient already exist with this <b>Phone Number</b> or{" "}
              <b>Email</b>
            </div>
          ),
        });
      } else if (res.errorType === "appointmentAlreadyExist") {
        toast.error("Appointment already exist!", {
          description: (
            <div className="dark:text-white">
              Appointment already exist for this <b>Patient</b>
            </div>
          ),
        });
      }
      setIsLoading(false);
      return;
    }
    if (res.status !== 200) {
      toast.error("Something went wrong");
      setIsLoading(false);
      return;
    }
    toast.success("Appointment added successfully");
    router.push("/secretary/appointments");
  }

  // search patient by name, email or phone 👇
  async function onSearch(values: z.infer<typeof searchSchema>) {
    const { data } = await getPatientList(values);
    setSearchResult(data);
  }

  return (
    <div className="space-y-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/secretary/appointments">
              Appointments
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Add Appointment</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card>
        <CardHeader>
          <CardTitle>Add Appointment </CardTitle>
          <CardDescription>Add new Appointment.</CardDescription>
        </CardHeader>

        {/* radio group */}
        <CardHeader className="flex-row justify-between">
          <RadioGroup defaultValue="option-one">
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value="option-one"
                id="option-one"
                onClick={() => setIsNewPatient(true)}
              />
              <Label htmlFor="option-one">New Patient</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value="option-two"
                id="option-two"
                onClick={() => setIsNewPatient(false)}
              />
              <Label htmlFor="option-two">Existing Patient</Label>
            </div>
          </RadioGroup>

          {!isNewPatient && isSelected && (
            <Button onClick={() => setIsSelected(false)}>Change Patient</Button>
          )}
        </CardHeader>
        {isNewPatient || isSelected ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <CardContent className="space-y-4">
                <Separator />

                <div className="grid lg:grid-cols-3 lg:gap-4 gap-2 w-full">
                  <FormField
                    disabled={isLoading}
                    control={form.control}
                    name="patientName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Patient Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter patient name"
                            {...field}
                            readOnly={!isNewPatient}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    disabled={isLoading}
                    control={form.control}
                    name="patientPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Patient Phone</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter patient phone"
                            {...field}
                            readOnly={!isNewPatient}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    disabled={isLoading}
                    control={form.control}
                    name="patientEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Patient Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter patient email"
                            {...field}
                            readOnly={!isNewPatient}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid lg:grid-cols-4 lg:gap-4 gap-2 w-full">
                  <FormField
                    disabled={isLoading}
                    control={form.control}
                    name="patientAge"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Patient Age</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter patient age"
                            {...field}
                            readOnly={!isNewPatient}
                            type="number"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="patientGender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <Select
                          disabled={isLoading || (!isNewPatient && isSelected)}
                          onValueChange={field.onChange}
                          defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="notSelected">
                              Not selected
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    disabled={isLoading}
                    control={form.control}
                    name="patientCity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Patient City</FormLabel>
                        <Select
                          disabled={isLoading || (!isNewPatient && isSelected)}
                          onValueChange={field.onChange}
                          defaultValue={field.value || ""}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select City" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {cities.map((city: any) => (
                              <SelectItem
                                key={city.id}
                                value={city.id.toString()}>
                                {city.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          You can manage Cities in{" "}
                          <Link
                            href="/secretary/settings"
                            className="underline">
                            Settings
                          </Link>
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    disabled={isLoading}
                    control={form.control}
                    name="patientStreet"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Patient Street</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter patient street"
                            {...field}
                            readOnly={!isNewPatient}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Separator />
                <div className="grid lg:grid-cols-2 lg:gap-4 gap-2 w-full">
                  <div className="space-y-2">
                    <FormField
                      disabled={isLoading}
                      control={form.control}
                      name="doctorFieldId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Doctor Field</FormLabel>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value);
                              getNewTypes(value);
                            }}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a field" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {doctorFields?.map((doctorField: any) => (
                                <SelectItem
                                  key={doctorField.id}
                                  value={doctorField.id.toString()}>
                                  {doctorField.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            You can manage Fields in{" "}
                            <Link
                              href="/secretary/fields"
                              className="underline">
                              Fields Page
                            </Link>
                            .
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      disabled={isLoading}
                      control={form.control}
                      name="doctorTypeId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Doctor Types</FormLabel>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value);
                              getNewDoctors(value);
                            }}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {doctorTypes?.map((doctorField: any) => (
                                <SelectItem
                                  key={doctorField.id}
                                  value={doctorField.id.toString()}>
                                  {doctorField.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            You can manage Types in{" "}
                            <Link
                              href="/secretary/fields"
                              className="underline">
                              Types Page
                            </Link>
                            .
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      disabled={isLoading}
                      control={form.control}
                      name="doctorId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Doctor</FormLabel>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value);
                              getNewVisitTimes({
                                doctorId: value,
                                doctorTypeId: form.getValues("doctorTypeId"),
                              });
                            }}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a doctor" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {doctors?.map((doctorField: any) => (
                                <SelectItem
                                  key={doctorField.id}
                                  value={doctorField.id.toString()}>
                                  {doctorField.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            You can manage Doctors in{" "}
                            <Link
                              href="/secretary/doctors"
                              className="underline">
                              Doctors Page
                            </Link>
                            .
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      disabled={isLoading}
                      control={form.control}
                      name="visitDate"
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
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <Loader className="w-5 h-5 animate-spin" />
                  ) : (
                    "Add Appointment"
                  )}
                </Button>
              </CardFooter>
            </form>
          </Form>
        ) : (
          <CardContent>
            <div className="space-y-4">
              {/* patient search form 👇 */}
              <Form {...searchForm}>
                <form
                  onSubmit={searchForm.handleSubmit(onSearch)}
                  className="w-2/3 space-y-6">
                  <FormField
                    control={searchForm.control}
                    name="search"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Search Patient</FormLabel>
                        <FormControl>
                          <Input placeholder="Search..." {...field} />
                        </FormControl>
                        <FormDescription>
                          You can search for patient by <b>Full Name</b>,{" "}
                          <b>Email</b> or <b>Phone Number</b>.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit">Search</Button>
                </form>
              </Form>

              {/* patient search result table 👇 */}
              <Card className="overflow-visible">
                <CardContent className="p-0">
                  <Table>
                    {searchResult?.length > 0 ? (
                      <>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Full Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Number</TableHead>
                            <TableHead>Select</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {searchResult.map((patient: any) => (
                            <TableRow key={patient.id}>
                              <TableCell>{patient.name}</TableCell>
                              <TableCell>{patient.email}</TableCell>
                              <TableCell>{patient.phone}</TableCell>
                              <TableCell>
                                <Button
                                  onClick={() => {
                                    form.setValue(
                                      "patientId",
                                      patient.id.toString()
                                    );
                                    form.setValue("patientName", patient.name);
                                    form.setValue(
                                      "patientEmail",
                                      patient.email
                                    );
                                    form.setValue(
                                      "patientPhone",
                                      patient.phone
                                    );
                                    form.setValue(
                                      "patientGender",
                                      patient.gender
                                    );
                                    form.setValue(
                                      "patientAge",
                                      patient.age.toString()
                                    );
                                    form.setValue(
                                      "patientCity",
                                      patient.City?.id.toString()
                                    );
                                    form.setValue(
                                      "patientStreet",
                                      patient.street
                                    );
                                    setIsSelected(true);
                                  }}>
                                  Select
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </>
                    ) : (
                      <TableBody>
                        <TableRow className="text-center">
                          <TableCell>No Patient Found</TableCell>
                        </TableRow>
                      </TableBody>
                    )}
                  </Table>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}

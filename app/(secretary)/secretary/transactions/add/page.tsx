"use client";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
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
  applyDiscountCode,
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { addTransaction } from "@/helper/transactionActions";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { getCurrency } from "@/helper/currencyActions";
import { updateVisitStatus } from "@/helper/visitActoins";

const newTransactionFormSchema = z.object({
  appointmentId: z.number(),
  amount: z
    .string()
    .min(1, { message: "Amount must be greater than $0" })
    .max(1000000),
  type: z
    .enum(["payment", "payback"], {
      required_error: "You need to select a transaction type.",
    })
    .default("payment"),
});

const searchSchema = z.object({
  search: z.string().min(1).max(50),
});

const discountSchema = z.object({
  appointmentId: z.number(),
  doctorId: z.number(),
  doctorTypeId: z.number(),
  code: z.string().min(1, "Code is required"),
});

export default function Page() {
  const router = useRouter();

  const params = useSearchParams().get("appid");
  const visitId = useSearchParams().get("vid");
  const status = useSearchParams().get("status");
  const [isLoading, setIsLoading] = useState(params ? true : false);
  const [isAdding, setIsAdding] = useState(false);
  const [isSelected, setIsSelected] = useState(params ? true : false);
  const [appointments, setAppointments] = useState<any[] | null>(null);
  const [data, setData] = useState<any>();
  const [currentCurrency, setCurrentCurrency] = useState("usd");
  const [currencyPrice, setCurrencyPrice] = useState(0);

  const form = useForm<z.infer<typeof newTransactionFormSchema>>({
    resolver: zodResolver(newTransactionFormSchema),
    defaultValues: {
      amount: "",
      type: "payment",
    },
  });

  const searchForm = useForm<z.infer<typeof searchSchema>>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      search: "",
    },
  });

  const discountForm = useForm<z.infer<typeof discountSchema>>({
    resolver: zodResolver(discountSchema),
    defaultValues: {
      appointmentId: 0,
      doctorId: 0,
      doctorTypeId: 0,
      code: "",
    },
  });

  // a function to fetch the data if params is set
  async function fetchData(id: string) {
    const data = await getAppointment({ id });

    if (data.status === 404) {
      toast.error("Appointment not found");
      router.push("/secretary/transactions");
    } else if (data.status === 500) {
      toast.error("Something went wrong");
      router.push("/secretary/transactions");
    } else {
      setData(data.data);
      form.setValue("appointmentId", data.data.id);
      discountForm.reset({
        appointmentId: data.data.id,
        doctorId: data.data.Doctor.id,
        doctorTypeId: data.data.DoctorType.id,
      });
      setIsLoading(false);
      const res = await getCurrency();

      setCurrencyPrice(res.data.price);
    }
  }
  useEffect(() => {
    if (params) fetchData(params);
  }, [params]);

  // for submiting the payment form to database 👇
  async function onSubmit(values: z.infer<typeof newTransactionFormSchema>) {
    setIsAdding(true);
    const res = await addTransaction({
      ...values,
      amount:
        currentCurrency === "usd"
          ? values.amount
          : Math.trunc(
              (parseFloat(values.amount || "0") / currencyPrice) * 100
            ) / 100,
    });

    if (res.status === 200) {
      const statusRes = await updateVisitStatus({
        data: { id: visitId, status },
      });
      if (statusRes.status === 200) {
        toast.success("Transaction added successfully");
        router.push("/secretary/transactions");
      } else {
        toast.error("Something went wrong");
      }
    } else if (res.status === 409) {
      toast.error("Amount exceeds the maximum allowed amount!");
      setIsAdding(false);
    } else {
      setIsAdding(false);
      toast.error("Something went wrong");
    }
  }

  // for searching apponitments by phone number or appointment id 👇
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

  // for selecting the appointment 👇
  async function onSelect(appointment: any) {
    const res = await getCurrency();
    setCurrencyPrice(res.data.price);
    setData(appointment);
    form.setValue("appointmentId", appointment.id);
    discountForm.reset({
      appointmentId: appointment.id,
      doctorId: appointment.Doctor.id,
      doctorTypeId: appointment.DoctorType.id,
    });
    setIsSelected(true);
  }

  // apply discount code 👇
  async function onDiscountSubmit(data: z.infer<typeof discountSchema>) {
    const res = await applyDiscountCode(data);

    if (res.status === 404) {
      toast.error("Code not found");
    }

    if (res.status === 409) {
      toast.error(res.error);
    }

    if (res.status === 200) {
      toast.success("Code applied successfully");
      await fetchData(form.getValues("appointmentId").toString());
    }
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
            <BreadcrumbLink href="/secretary/transactions">
              Transactions
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Add Transaction</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card>
        <CardHeader>
          <CardTitle>Add Transaction </CardTitle>
          <CardDescription>
            Add a new Transaction for{" "}
            <span className="font-bold">Appointment ID {data?.id}</span>.
          </CardDescription>
        </CardHeader>
        {/* if appointment is selected then show the form else show the search form 👇 */}
        {!isSelected ? (
          <>
            {/* Search Form 👇 */}
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
                        <FormLabel>Search</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Search for Appointment"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Search for Appointment by <b>Full Name</b>,{" "}
                          <b>Phone</b>, <b>Email</b> or <b>Appointment ID</b>.
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

            {/* Result Table 👇 */}
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
                    <TableHead>Select</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {appointments.map((appointment: any) => {
                    const serviceCost = appointment.DoctorType.price;
                    const discount = appointment.Discount?.percentage || 0;
                    const priceAfterDiscount =
                      serviceCost * (1 - discount / 100);
                    const totalPaid = appointment.Transaction?.map(
                      (t: any) => t.amount
                    ).reduce((a: any, b: any) => a + b, 0);

                    return (
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
                            {priceAfterDiscount <= totalPaid ? (
                              <TooltipProvider>
                                <Tooltip delayDuration={0}>
                                  <TooltipTrigger>
                                    <Button disabled>Select</Button>
                                  </TooltipTrigger>
                                  <TooltipContent className="text-center">
                                    <b>Pied</b>
                                    <p>All the amount has been paid.</p>
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
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </>
        ) : (
          <CardContent className="space-y-8">
            {/* Patient Detail 👇 */}
            <div className="mt-4 space-y-4">
              <Label className="text-lg">Patient Detail</Label>
              <div className="grid lg:grid-cols-3 gap-4">
                <Label className="space-y-2">
                  <span>Full Name</span>
                  <Input
                    readOnly
                    placeholder="Patinet Name"
                    value={data?.Patient.name}
                  />
                </Label>
                <Label className="space-y-2">
                  <span>Phone</span>
                  <Input
                    readOnly
                    placeholder="Patinet Phone"
                    value={data?.Patient.phone}
                  />
                </Label>
                <Label className="space-y-2">
                  <span>Email</span>
                  <Input
                    readOnly
                    placeholder="Patinet Email"
                    value={data?.Patient.email}
                  />
                </Label>
              </div>
              <div className="grid lg:grid-cols-4 gap-4">
                <Label className="space-y-2">
                  <span>Age</span>
                  <Input
                    readOnly
                    placeholder="Patinet Age"
                    value={data?.Patient.age}
                  />
                </Label>
                <Label className="space-y-2">
                  <span>Gender</span>
                  <Input
                    readOnly
                    placeholder="Patinet Gender"
                    value={
                      data?.Patient.gender === "notSelected"
                        ? "Not Selected"
                        : data?.Patient.gender
                    }
                  />
                </Label>
                <Label className="space-y-2">
                  <span>City</span>
                  <Input
                    readOnly
                    placeholder="Patinet City"
                    value={data?.Patient.City.name}
                  />
                </Label>
                <Label className="space-y-2">
                  <span>Street</span>
                  <Input
                    readOnly
                    placeholder="Patinet Sreet"
                    value={data?.Patient.street}
                  />
                </Label>
              </div>
            </div>
            <Separator />

            {/* Doctor Detail 👇 */}
            <div className="mt-4 space-y-4">
              <Label className="text-md ">Doctor Detail</Label>
              <div className="grid lg:grid-cols-3 gap-4 mt-4">
                <div className="flex items-end gap-4">
                  <Avatar className="w-14 h-14">
                    <AvatarImage src={data?.Doctor.image || ""} />
                    <AvatarFallback>
                      {data?.Doctor.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>

                  <Label className="space-y-2 w-full">
                    <span>Full Name</span>
                    <Input
                      readOnly
                      placeholder="Doctor Name"
                      value={data?.Doctor.name}
                    />
                  </Label>
                </div>
                <Label className="space-y-2">
                  <span>Phone</span>
                  <Input
                    readOnly
                    placeholder="Doctor Phone"
                    value={data?.Doctor.phone}
                  />
                </Label>
                <Label className="space-y-2">
                  <span>Email</span>
                  <Input
                    readOnly
                    placeholder="Doctor Email"
                    value={data?.Doctor.email}
                  />
                </Label>
              </div>
            </div>
            <Separator />

            {/* Doctor Field and Type 👇 */}
            <div className="mt-4 space-y-4">
              <Label className="text-md ">Doctor Field and Type</Label>
              <div className="grid lg:grid-cols-3 gap-4 mt-1">
                <Label className="space-y-2">
                  <span>Doctor Field</span>
                  <Input
                    readOnly
                    placeholder="Doctor Field"
                    value={data?.DoctorType.DoctorField.name}
                  />
                </Label>
                <Label className="space-y-2">
                  <span>Doctor Type</span>
                  <Input
                    readOnly
                    placeholder="Doctor Type"
                    value={data?.DoctorType.name}
                  />
                </Label>
                <Label className="space-y-2">
                  <span>Doctor Type Price</span>
                  <Input
                    readOnly
                    placeholder="Doctor Type Price"
                    value={`$${data?.DoctorType.price}`}
                  />
                </Label>
              </div>
            </div>
            <Separator />

            {/* Payment Information 👇 */}
            <div className="font-medium grid grid-cols-2 w-fit gap-x-6 gap-y-3 pt-8">
              <h1>Currency:</h1>
              <RadioGroup
                defaultValue="usd"
                className="flex gap-4"
                onValueChange={(e) => setCurrentCurrency(e)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="usd" id="usd" />
                  <Label htmlFor="usd">USD</Label>
                </div>
                <Separator orientation="vertical" />
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="iqd" id="iqd" />
                  <Label htmlFor="iqd">IQD</Label>
                </div>
              </RadioGroup>

              <h1>Service Price:</h1>
              <h1>
                {currentCurrency === "usd" ? "$" : "IQD"}{" "}
                {(
                  data?.DoctorType.price *
                  (currentCurrency === "iqd" ? currencyPrice : 1)
                ).toLocaleString()}
              </h1>
              <h1>Discount:</h1>
              <h1>
                {currentCurrency === "usd" ? "$" : "IQD"}{" "}
                {(
                  data?.DoctorType.price *
                  (1 - (data?.Discount?.percentage || 0) / 100) *
                  (currentCurrency === "iqd" ? currencyPrice : 1)
                ).toLocaleString()}{" "}
                <Badge variant={"destructive"}>
                  {data?.Discount?.code} {data?.Discount?.percentage || 0}%
                </Badge>
              </h1>
              <Separator />
              <Separator />
              <h1>Total Paid:</h1>
              {/* sum of ammount of transaction array */}
              <h1>
                {currentCurrency === "usd" ? "$" : "IQD"}{" "}
                {(
                  data?.Transaction.reduce(
                    (a: number, b: any) => a + b.amount,
                    0
                  ) * (currentCurrency === "iqd" ? currencyPrice : 1)
                ).toLocaleString()}
              </h1>

              <h1 className="font-bold">Remaining (Debit) :</h1>
              <h1 className="font-bold">
                {currentCurrency === "usd" ? "$" : "IQD"}{" "}
                {Math.max(
                  0,
                  (data?.DoctorType.price *
                    (1 - (data?.Discount?.percentage || 0) / 100) -
                    data?.Transaction.reduce(
                      (a: number, b: any) => a + b.amount,
                      0
                    )) *
                    (currentCurrency === "iqd" ? currencyPrice : 1)
                ).toLocaleString()}
              </h1>
            </div>
            {/* Payment Form 👇 */}
            <div className="mt-4">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="bg-green-100 dark:bg-green-900 p-4 rounded space-y-6">
                  <FormField
                    disabled={isAdding}
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Amount"
                            {...field}
                            type="number"
                            max={Number(
                              (
                                (data?.DoctorType.price *
                                  (1 -
                                    (data?.Discount?.percentage || 0) / 100) -
                                  data?.Transaction.reduce(
                                    (a: number, b: any) => a + b.amount,
                                    0
                                  )) *
                                (currentCurrency === "iqd" ? currencyPrice : 1)
                              ).toLocaleString()
                            )}
                          />
                        </FormControl>
                        <FormDescription>
                          Amount of USD would be $
                          {currentCurrency === "usd"
                            ? form.getValues("amount") || 0
                            : Math.trunc(
                                (parseFloat(form.getValues("amount") || "0") /
                                  currencyPrice) *
                                  100
                              ) / 100}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Transaction Type...</FormLabel>
                        <FormControl>
                          <RadioGroup
                            disabled={isAdding}
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1">
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem
                                  value="payment"
                                  disabled={isAdding}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Payment
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem
                                  value="payback"
                                  disabled={isAdding}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Payback
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="px-14" disabled={isAdding}>
                    {isAdding ? (
                      <Loader className="w-5 h-5 animate-spin" />
                    ) : (
                      "Pay"
                    )}
                  </Button>
                </form>
              </Form>
              <Form {...discountForm}>
                <form
                  onSubmit={discountForm.handleSubmit(onDiscountSubmit)}
                  className="p-4 rounded space-y-6">
                  <FormField
                    control={discountForm.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Discount Code</FormLabel>
                        <FormControl>
                          <Input placeholder="Discount Code" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="px-8">
                    Apply
                  </Button>
                </form>
              </Form>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}

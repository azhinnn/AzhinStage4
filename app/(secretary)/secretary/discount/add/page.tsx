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
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Loader } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { GetDoctorList } from "@/helper/doctorActions";
import { addDiscount } from "@/helper/discountActions";

const doctorFormSchema = z
  .object({
    name: z.string().min(2).max(50),
    code: z.string().min(2).max(50),
    percentage: z.string(),
    startDate: z.string(),
    endDate: z.string(),
    doctorId: z.number(),
    doctorName: z.string(),
    doctorPhone: z.string(),
    doctorFieldName: z.string(),
    doctorTypeId: z.string(),
    doctorTypeName: z.string(),
  })
  .refine(
    (data) => {
      const startDate = new Date(data.startDate);
      const endDate = new Date(data.endDate);

      return startDate < endDate;
    },
    {
      message: "Start date must be smaller than end date",
      path: ["startDate"],
    }
  );

const searchFormSchema = z.object({
  search: z.string().min(2).max(50),
});

export default function Page() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const [isTypeSelected, setIsTypeSelected] = useState(false);
  const [searchResult, setSearchResult] = useState([]);

  const form = useForm<z.infer<typeof doctorFormSchema>>({
    resolver: zodResolver(doctorFormSchema),
    defaultValues: {
      name: "",
      code: "",
      percentage: "",
      startDate: "",
      endDate: "",
      doctorName: "",
      doctorPhone: "",
      doctorFieldName: "",
      doctorTypeId: "",
      doctorTypeName: "",
    },
  });

  const searchForm = useForm<z.infer<typeof searchFormSchema>>({
    resolver: zodResolver(searchFormSchema),
  });

  async function onSubmit(values: z.infer<typeof doctorFormSchema>) {
    setIsLoading(true);

    const data = await addDiscount(values);

    if (data.status === 409) {
      toast.error("A Discount already exists!", {
        description: (
          <div className="dark:text-white">
            Discount already exists with this <b>Name</b> or <b>Code</b>.
          </div>
        ),
      });
      setIsLoading(false);
      return;
    } else if (data.status === 200) {
      toast.success("Discount added successfully");
      router.push("/secretary/discount");
    } else {
      toast.error("Something went wrong");
      setIsLoading(false);
      return;
    }
  }

  async function onSearch(values: z.infer<typeof searchFormSchema>) {
    const { data } = await GetDoctorList(values);

    if (data.length === 0) {
      toast.error("No doctor found");
      return;
    }

    setSearchResult(data);
  }

  return (
    <div className="space-y-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/secretary/discount">
              Discounts
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Add Discount</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Card>
        {!isSelected ? (
          <>
            <Form {...searchForm}>
              <form onSubmit={searchForm.handleSubmit(onSearch)}>
                <CardHeader>
                  <CardTitle>Search</CardTitle>
                  <CardDescription>
                    Search for a doctor by <b>Full Name</b>, <b>Phone</b> or{" "}
                    <b>Email</b>.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 grid grid-cols-2 items-end gap-4">
                  <FormField
                    disabled={isLoading}
                    control={searchForm.control}
                    name="search"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Search Doctor</FormLabel>
                        <FormControl>
                          <Input placeholder="Search for Doctor" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit">Search</Button>
                </CardContent>
              </form>
            </Form>
            <Separator />
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Field</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {searchResult.map((doctor: any) => (
                  <TableRow key={doctor.id}>
                    <TableCell>{doctor.name}</TableCell>
                    <TableCell>{doctor.phone}</TableCell>
                    <TableCell>{doctor.email}</TableCell>
                    <TableCell>{doctor.DoctorField.name}</TableCell>
                    <TableCell>
                      <Select
                        onValueChange={(e) => {
                          form.setValue("doctorTypeId", e);
                          const type = doctor.DoctorType.find(
                            (doctorType: any) => doctorType.id === Number(e)
                          );

                          form.setValue("doctorTypeName", type.name);
                          setIsTypeSelected(true);
                        }}>
                        <SelectTrigger className="w-[140px]">
                          <SelectValue placeholder="Select Type" />
                        </SelectTrigger>
                        <SelectContent>
                          {doctor.DoctorType.map((doctorType: any) => (
                            <SelectItem
                              value={doctorType.id.toString()}
                              key={doctorType.id}>
                              {doctorType.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Button
                        disabled={!isTypeSelected}
                        onClick={() => {
                          searchForm.reset();

                          setIsSelected(true);
                          form.setValue("doctorPhone", doctor.phone);
                          form.setValue("doctorName", doctor.name);
                          form.setValue("doctorId", doctor.id);
                          form.setValue(
                            "doctorFieldName",
                            doctor.DoctorField.name
                          );
                        }}>
                        Select
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardHeader className="flex-row justify-between">
                <div className="space-y-2">
                  <CardTitle>Add Discount</CardTitle>
                  <CardDescription>Add a new discount.</CardDescription>
                </div>
                <Button onClick={() => setIsSelected(false)}>
                  Change Doctor
                </Button>
              </CardHeader>
              <CardContent>
                <div className=" grid grid-cols-2 items-end gap-4">
                  {/* Doctor Detail Fields 👇 */}
                  <FormField
                    disabled={isLoading}
                    control={form.control}
                    name="doctorName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Doctor Name</FormLabel>
                        <FormControl>
                          <Input readOnly placeholder="Enter name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    disabled={isLoading}
                    control={form.control}
                    name="doctorPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Doctor Phone</FormLabel>
                        <FormControl>
                          <Input
                            readOnly
                            placeholder="Doctor Phone"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    disabled={isLoading}
                    control={form.control}
                    name="doctorTypeName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Doctor Type</FormLabel>
                        <FormControl>
                          <Input readOnly placeholder="Enter name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />{" "}
                  <FormField
                    disabled={isLoading}
                    control={form.control}
                    name="doctorFieldName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Doctor Field</FormLabel>
                        <FormControl>
                          <Input readOnly placeholder="Enter name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Discount fields 👇 */}
                  <FormField
                    disabled={isLoading}
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Discount Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    disabled={isLoading}
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Discount Code</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter discount code" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    disabled={isLoading}
                    control={form.control}
                    name="percentage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Percentage %</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter percentage"
                            {...field}
                            type="number"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    disabled={isLoading}
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter start date"
                            {...field}
                            type="date"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    disabled={isLoading}
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Date</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter end date"
                            {...field}
                            type="date"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    "Add Discount"
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

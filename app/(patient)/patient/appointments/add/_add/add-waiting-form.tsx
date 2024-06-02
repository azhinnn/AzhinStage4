"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  FolderPlus,
  Loader,
  Microscope,
  Plus,
  Stethoscope,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { getDoctorTypeList } from "@/helper/doctorTypeActions";
import { GetDoctorListByType } from "@/helper/doctorActions";
import { toast } from "sonner";
import { addWaiting } from "@/helper/waitingActions";
import { useRouter } from "next/navigation";

const FormSchema = z.object({
  patientId: z.string({
    required_error: "Patient is required",
  }),
  doctorId: z.string({
    required_error: "Doctor is required",
  }),
  doctorFieldId: z.string({
    required_error: "Doctor Field is required",
  }),
  doctorTypeId: z.string({
    required_error: "Doctor Type is required",
  }),
});

export default function AddWaitingForm({
  id,
  doctorFields,
}: {
  id: string;
  doctorFields: any;
}) {
  const [doctorTypes, setDoctorTypes] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      patientId: id?.toString(),
      doctorId: "",
      doctorFieldId: "",
      doctorTypeId: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsAdding(true);
    const res = await addWaiting(data);
    if (res.status === 200) {
      toast.success("Appointment added successfully", {
        description: (
          <div className="dark:text-white">
            The Appointment is <b>Pending</b> for confirmation, Please wait.
          </div>
        ),
      });
      router.push("/patient/appointments");
    } else if (res.status === 409) {
      toast.warning(res.error, {
        description: (
          <div className="dark:text-white">
            You already have{" "}
            {res.errorType === "requestAlreadyExists"
              ? "a Request"
              : "an Appointment"}{" "}
            with this Doctor!
          </div>
        ),
      });
    } else {
      toast.error("Something went wrong");
    }
    setIsAdding(false);
  }

  // get doctor types
  async function getDoctorTypes() {
    const { data: types } = await getDoctorTypeList(
      form.getValues("doctorFieldId")
    );
    setDoctorTypes(types);
  }

  // get doctors
  async function getDoctors() {
    const { data: doctors } = await GetDoctorListByType(
      form.getValues("doctorTypeId")
    );
    setDoctors(doctors);
  }

  return (
    <div className="space-y-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/patient/appointments">
              Appointments
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Add Appointment</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="font-bold text-3xl flex items-start gap-2">
        <Plus className="w-8 h-8 drop-shadow-md" /> Add Appointment
      </h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* select doctor field 👇 */}
          <FormField
            control={form.control}
            name="doctorFieldId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <FolderPlus className="w-4 h-4" />
                  Field
                </FormLabel>
                <Select
                  disabled={isAdding}
                  onValueChange={(value) => {
                    field.onChange(value);
                    getDoctorTypes();
                  }}
                  defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a Doctor Field" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {doctorFields.map((field: any) => (
                      <SelectItem key={field.id} value={field?.id.toString()}>
                        {field.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* select doctor type 👇 */}
          <FormField
            control={form.control}
            name="doctorTypeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Microscope className="w-4 h-4" />
                  Type
                </FormLabel>
                <Select
                  disabled={!form.getValues("doctorFieldId") || isAdding}
                  onValueChange={(value) => {
                    field.onChange(value);
                    getDoctors();
                  }}
                  defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a Doctor Type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {doctorTypes.length > 0 &&
                      doctorTypes.map((field: any) => (
                        <SelectItem key={field.id} value={field?.id.toString()}>
                          {field.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* select doctor 👇 */}
          <FormField
            control={form.control}
            name="doctorId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Stethoscope className="w-4 h-4" />
                  Doctor
                </FormLabel>
                <Select
                  disabled={!form.getValues("doctorTypeId") || isAdding}
                  onValueChange={field.onChange}
                  defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a Doctor" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {doctors.length > 0 &&
                      doctors.map((field: any) => (
                        <SelectItem key={field.id} value={field?.id.toString()}>
                          {field.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={!form.getValues("doctorId") || isAdding}
            className="w-full">
            {isAdding ? (
              <Loader className="w-5 h-5 animate-spin" />
            ) : (
              "Request Appointment"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}

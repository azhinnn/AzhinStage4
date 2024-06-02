import Link from "next/link";
import Image from "next/image";
import clinicImg from "@/public/clinic.jpg";
import Header from "@/components/global/header";
import Footer from "@/components/global/footer";
import { GetDoctors } from "@/helper/doctorActions";

import { headers } from "next/headers";
import { DoctorsSection } from "@/components/doctors";
import { getSecretaries } from "@/helper/secretaryActions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Contact2Icon, PhoneIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

export default async function Page() {
  const { data: doctors } = (await GetDoctors()) || [];
  const { data: secretary } = await getSecretaries();

  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container flex flex-col items-center justify-center space-y-4 text-center px-4 md:px-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Your Health is Our Priority
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Experience the best in dental care at our clinic. Visit our
                website for more information and to schedule your appointment.
              </p>
            </div>
            <div className="flex justify-center">
              <Button asChild>
                <Link href="/patient/appointments/add">
                  Schedule an Appointment
                </Link>
              </Button>
            </div>
          </div>
        </section>
        <section className="w-full container px-4 md:px-6 rounded-xl overflow-hidden">
          <Image
            alt="Image"
            className="mx-auto aspect-video object-cover object-center sm:w-full rounded-xl"
            height="1000"
            src={clinicImg}
            width="1000"
          />
        </section>
        <section
          className="w-full py-12 md:py-24 container px-4 md:px-6"
          id="services">
          <div className="flex flex-col gap-4 md:gap-12">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Our Services
              </h2>
              <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                We offer a wide range of medical services to meet your
                healthcare needs. Our team of experienced healthcare
                professionals is dedicated to providing personalized care in a
                comfortable and welcoming environment.
              </p>
            </div>
            <ul className="grid gap-4 md:grid-cols-2">
              <li>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Filling</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    General and Pediatric Dentists provide fillings to restore
                    decayed teeth.
                  </p>
                </div>
              </li>
              <li>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Cleaning</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    General Dentists offer professional teeth cleaning to
                    maintain oral hygiene.
                  </p>
                </div>
              </li>
              <li>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Oral Surgery</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Oral and Maxillofacial Surgeons perform complex surgeries
                    for oral health.
                  </p>
                </div>
              </li>
              <li>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Correction</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Orthodontists specialize in correcting misaligned teeth and
                    jaws.
                  </p>
                </div>
              </li>
              <li>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Bridges</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    General Dentists create dental bridges to replace missing
                    teeth.
                  </p>
                </div>
              </li>
              <li>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Whitening</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    General Dentists offer teeth whitening services for a
                    brighter smile.
                  </p>
                </div>
              </li>
              <li>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Implants</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    General Dentists provide dental implants to replace lost
                    teeth.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </section>

        {/* Doctors Section */}
        <section
          className="w-full py-12 md:py-24 bg-muted text-center"
          id="doctors">
          <div className="container flex items-center flex-col gap-y-4">
            <div className="space-y-2 text-center max-w-[600px]">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Meet Our Doctors
              </h2>
              <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Meet our exceptional doctors who are dedicated to providing the
                best care to each and every patient.
              </p>
            </div>
            <div className="flex flex-col items-center w-full">
              <DoctorsSection doctors={doctors || []} />
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="w-full py-12 md:py-24" id="contact">
          <div className="container grid items-center gap-4 px-4 md:px-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Contact Us
              </h2>
              <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Ready to make an appointment? Contact us today to schedule a
                visit.
              </p>
            </div>
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Secretaries</CardTitle>
                  <CardDescription>
                    You can contact the secretary to get more information
                  </CardDescription>
                </CardHeader>
                <Separator className="mb-4" />
                <CardContent className="flex flex-wrap gap-8 items-center">
                  {secretary.map((sec: any, index: number) => (
                    <div className="flex items-center gap-2" key={index}>
                      <Avatar className="size-14">
                        <AvatarFallback>
                          <Contact2Icon className="size-6 text-muted-foreground" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-[3px]">
                        <h1 className="text-xl font-semibold capitalize">
                          {sec.name}
                        </h1>
                        <p className="text-muted-foreground flex items-center gap-2">
                          <PhoneIcon className="size-4" />
                          {sec.phone.replace(
                            /(\d{4})(\d{3})(\d{4})/,
                            "$1 $2 $3"
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

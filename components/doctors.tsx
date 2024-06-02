"use client";
import Autoplay from "embla-carousel-autoplay";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import { FolderPlus, Microscope } from "lucide-react";
import { useRef } from "react";
import DoctorPlaceHolder from "@/public/placeholder-doctor.png";

export function DoctorsSection({ doctors }: { doctors: any }) {
  const plugin = useRef(Autoplay({ delay: 4000, stopOnInteraction: true }));

  return (
    <Carousel
      plugins={[plugin.current]}
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
      opts={{
        align: "start",
      }}
      className="w-[70%] md:w-[80%]">
      <CarouselContent>
        {doctors?.map((doctor: any, index: any) => (
          <CarouselItem key={index} className="md:basis-1/2">
            <Card key={doctor.id}>
              <CardHeader>
                <Image
                  alt={`${doctor.name}'s image`}
                  src={doctor.image || DoctorPlaceHolder}
                  className="aspect-square m-auto overflow-hidden rounded-lg object-cover object-center"
                  height="300"
                  width="300"
                />
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-left line-clamp-1">
                    Dr. {doctor.name}
                  </h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-0.5">
                    <FolderPlus className="min-h-4 min-w-4 mr-2 max-h-4 max-w-4" />
                    <span className="line-clamp-1 text-left">
                      {doctor.DoctorField?.name}
                    </span>
                  </p>
                  <p className="text-sm text-muted-foreground flex items-center gap-0.5">
                    <Microscope className="min-h-4 min-w-4 mr-2 max-h-4 max-w-4" />
                    <span className="line-clamp-1 text-left">
                      {doctor.DoctorType?.map((type: any) => type.name).join(
                        ", "
                      )}
                    </span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}

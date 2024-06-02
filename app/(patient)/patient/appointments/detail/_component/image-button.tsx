"use client";

import { Button } from "@/components/ui/button";
import { DownloadIcon, ImageIcon } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Image from "next/image";

export default function ImageButton({
  id,
  imageUrl,
}: {
  id: number;
  imageUrl: string | null;
}) {
  async function downloadVisitImage(id: number, imageUrl: string | null) {
    if (imageUrl) {
      const response = await fetch(imageUrl);
      const blob = await response.blob();

      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `visit_image_${id}.jpg`;
      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild disabled={!imageUrl}>
        <Button size={"icon"}>
          <ImageIcon className="w-4 h-4" />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center">
            Image Preview
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            Image Preview of Visit
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div>
          <div className="w-full flex flex-col items-center justify-center">
            <Image
              src={imageUrl || ""}
              alt="Visit Image"
              width={300}
              height={300}
              className="object-contain rounded max-w-[300px] max-h-[300px]"
            />
          </div>
        </div>
        <div className="flex items-center justify-center gap-2">
          <Button
            size={"icon"}
            onClick={() => {
              downloadVisitImage(id, imageUrl);
            }}>
            <DownloadIcon className="w-4 h-4" />
          </Button>
          <AlertDialogCancel>Close</AlertDialogCancel>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}

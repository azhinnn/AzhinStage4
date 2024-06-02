"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Loader } from "lucide-react";
import { useState } from "react";
import { useEdgeStore } from "@/lib/edgestore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateDoctorImage } from "@/helper/doctorActions";

export default function ChangeDoctorImage(data: any) {
  const router = useRouter();
  const [file, setFile] = useState<File | undefined>();
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { edgestore } = useEdgeStore();

  async function handleImageUpload() {
    if (file) {
      setIsUploading(true);
      const res = await edgestore.publicFiles.upload({
        file,
        options: data?.data?.image
          ? { replaceTargetUrl: data?.data?.image }
          : {},
        onProgressChange: (progress) => {
          setProgress(progress);
        },
      });

      await updateDoctorImage({
        id: data?.data?.id,
        image: res.url,
      });

      setProgress(0);
      setIsUploading(false);
      setFile(undefined);
      router.refresh();
      toast.success("Image Updated successfully");
    }
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>Profile Picture</CardTitle>
        <CardDescription>
          Upload or change your profile picture.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center flex-col items-center gap-4">
        <Avatar className="w-24 h-24">
          <AvatarImage
            src={file ? URL.createObjectURL(file) : data?.data?.image || ""}
          />
          <AvatarFallback>{data?.data?.name.charAt(0)}</AvatarFallback>
        </Avatar>
        {isUploading && <Progress value={progress} className="w-full" />}

        {file ? (
          <div className="w-80 flex gap-4">
            <Button
              disabled={isUploading}
              className="w-full"
              onClick={() => setFile(undefined)}
              variant={"outline"}>
              Cancel
            </Button>
            <Button
              disabled={isUploading}
              className="w-full"
              onClick={handleImageUpload}>
              {isUploading ? <Loader className="animate-spin" /> : "Upload"}
            </Button>
          </div>
        ) : (
          <Button asChild className="px-8" disabled={isUploading}>
            <Label>
              Upload{" "}
              <Input
                type="file"
                onChange={(e) => setFile(e.target.files?.[0])}
                className="hidden"
              />
            </Label>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

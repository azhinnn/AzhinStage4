import { Loader } from "lucide-react";

export default function Loading() {
  return (
    <div className="container h-full flex items-center justify-center">
      <Loader className="w-5 h-5 animate-spin" />
    </div>
  );
}

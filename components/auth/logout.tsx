import { Button } from "../ui/button";
import { Icon } from "@iconify/react/dist/iconify.js";
import { logoutUser } from "@/helper/authActions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function LogOutBtn() {
  const router = useRouter();

  async function onLogout() {
    await logoutUser();

    toast.success("Logout Successful");
    router.push("/login");
  }
  return (
    <div className="mt-auto md:mb-0 mb-32">
      <Button
        onClick={onLogout}
        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-all"
        variant={"destructive"}>
        <Icon icon={"heroicons-outline:logout"} className="h-4 w-4" />
        Logout
      </Button>
    </div>
  );
}

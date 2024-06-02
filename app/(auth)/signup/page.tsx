import Image from "next/image";
import loginImg from "@/public/login-img.svg";
import SignupForm from "./_form/signupForm";
import { getCities } from "@/helper/cityActions";

export default async function Page() {
  const { data: cities } = await getCities();

  return (
    <div className="w-full grid min-h-[400px] items-center lg:grid-cols-2 lg:min-h-0 lg:gap-0 py-8">
      <div className="hidden lg:flex lg:items-center lg:justify-center lg:py-12 p-16 pr-0">
        <Image
          alt="Image"
          className="h-full w-full object-cover rounded-xl"
          height="400"
          src={loginImg}
          style={{
            aspectRatio: "600/400",
            objectFit: "cover",
          }}
          width="600"
        />
      </div>
      <SignupForm cities={cities} />
    </div>
  );
}

import { getUserCookie } from "@/helper/authFunctions";
import AddWaitingForm from "./_add/add-waiting-form";
import { getDoctorFields } from "@/helper/doctorFieldActions";

export default async function Pgae() {
  const { id } = (await getUserCookie()) as any;
  const { data } = await getDoctorFields();

  return (
    <div>
      <AddWaitingForm id={id} doctorFields={data} />
    </div>
  );
}

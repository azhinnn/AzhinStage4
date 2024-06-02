import { getCities } from "@/helper/cityActions";
import AddPatientForm from "./form/addPatientForm";

export default async function Page() {
  const cities = await getCities();
  return (
    <>
      <AddPatientForm cities={cities?.data || []} />
    </>
  );
}

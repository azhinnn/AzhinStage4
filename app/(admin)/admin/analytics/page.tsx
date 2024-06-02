import {
  NumberOfTransactionsByEachDoctor,
  NumberOfVisitsByEachDoctor,
  TotalAmountOfTransactionByEachDoctor,
  patientsByDoctors,
} from "@/helper/analyticsActions";
import { LineChart } from "lucide-react";
import RootCharts from "./_component/root-charts";
import SearchDialogDoctor from "./_component/search-dialog-doctor";
import SearchDialogField from "./_component/search-dialog-field";
import SearchDialogType from "./_component/search-dialog-type";

export default async function Page() {
  const patientsByDoctor = await patientsByDoctors({
    from: undefined,
    to: undefined,
  });

  const numberOfTransactionsByEachDoctor =
    await NumberOfTransactionsByEachDoctor({ from: undefined, to: undefined });

  const numberOfVisitsByEachDoctor = await NumberOfVisitsByEachDoctor({
    from: undefined,
    to: undefined,
  });

  const totalAmountOfTransactionByEachDoctor =
    await TotalAmountOfTransactionByEachDoctor({
      from: undefined,
      to: undefined,
    });

  return (
    <div className="space-y-8">
      <h1 className="font-semibold text-lg md:text-xl flex items-center gap-2 ">
        <LineChart className="w-6 h-6" /> Analytics
      </h1>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        <SearchDialogDoctor />
        <SearchDialogField />
        <SearchDialogType />
      </div>
      <RootCharts
        app={patientsByDoctor}
        visit={numberOfVisitsByEachDoctor}
        tran1={numberOfTransactionsByEachDoctor}
        tran2={totalAmountOfTransactionByEachDoctor}
      />
    </div>
  );
}

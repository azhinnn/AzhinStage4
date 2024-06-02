"use client";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { getCurrency } from "@/helper/currencyActions";

export default function TransactionSummury({ appointment }: any) {
  const [currentCurrency, setCurrentCurrency] = useState("usd");
  const [currencyPrice, setCurrencyPrice] = useState(0);

  async function fetchData() {
    const res = await getCurrency();
    setCurrencyPrice(res.data.price);
  }

  useEffect(() => {
    fetchData();
  }, [currentCurrency]);

  const serviceCoast = appointment?.DoctorType?.price;
  const discount = appointment?.Discount?.percentage || 0;
  const discountCode = appointment?.Discount?.code || "";
  const serviceCoastAfterDiscount = (
    serviceCoast *
    (1 - discount / 100)
  ).toFixed(2);

  const totalPaid = appointment?.Transaction?.reduce(
    (a: any, b: any) => a + b.amount,
    0
  ).toFixed(2);
  const remaining = parseFloat(serviceCoastAfterDiscount) - totalPaid;

  return (
    <div className="font-medium grid grid-cols-2 w-fit gap-x-6 gap-y-3 pt-8">
      <h1>Currency:</h1>
      <RadioGroup
        defaultValue="usd"
        className="flex gap-4"
        onValueChange={(e) => setCurrentCurrency(e)}>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="usd" id="usd" />
          <Label htmlFor="usd">USD</Label>
        </div>
        <Separator orientation="vertical" />
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="iqd" id="iqd" />
          <Label htmlFor="iqd">IQD</Label>
        </div>
      </RadioGroup>
      <h1>Service Price:</h1>
      <h1>
        {currentCurrency === "usd" ? "$" : "IQD"}{" "}
        {(
          serviceCoast * (currentCurrency === "iqd" ? currencyPrice : 1)
        ).toLocaleString()}
      </h1>
      <h1>Discount:</h1>
      <h1>
        {currentCurrency === "usd" ? "$" : "IQD"}{" "}
        {(
          Number(serviceCoastAfterDiscount) *
          (currentCurrency === "iqd" ? currencyPrice : 1)
        ).toLocaleString()}{" "}
        <Badge variant={"destructive"}>
          {discountCode} {discount}%
        </Badge>
      </h1>
      <Separator />
      <Separator />
      <h1>Total Paid:</h1>
      <h1>
        {currentCurrency === "usd" ? "$" : "IQD"}{" "}
        {(
          totalPaid * (currentCurrency === "iqd" ? currencyPrice : 1)
        ).toLocaleString()}
      </h1>

      <h1 className="font-bold">Remaining (Debit) :</h1>
      <h1 className="font-bold">
        {currentCurrency === "usd" ? "$" : "IQD"}{" "}
        {(
          remaining * (currentCurrency === "iqd" ? currencyPrice : 1)
        ).toLocaleString()}
      </h1>
    </div>
  );
}

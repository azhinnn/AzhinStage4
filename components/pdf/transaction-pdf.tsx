"use client";
import React, { useEffect, useState } from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFDownloadLink,
} from "@react-pdf/renderer";
import { FileDownIcon, Loader } from "lucide-react";
import { format } from "date-fns";

interface TransactionPdfProps {
  // companyName: string;
  transactionId: number;
  appointmentId: number;
  doctorName: string;
  doctorField: string;
  doctorType: string;
  patientName: string;
  patientPhone: string;
  transactionDate: string;
  transactionAmount: number;
  transactionType: string;
}

export default function TransactionPdf({
  props,
  currency
}:
{
  props: TransactionPdfProps;
  currency: number;
}) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // or a loading indicator
  }

  return (
    <PDFDownloadLink
      document={<PdfTemplate props={props} currency={currency} />}
      fileName={`Transaction ID: ${props.transactionId}`}>
      {({ blob, url, loading, error }) => {
        return loading ? (
          <div className="flex items-center gap-2">
            <Loader className="h-4 w-4" />
            Loading Document...
          </div>
        ) : (
          "Download PDF"
        );
      }}
    </PDFDownloadLink>
  );
}

export function PdfTemplate({ props, currency }: { props: TransactionPdfProps, currency:number }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* <Text style={styles.header}>{props.companyName}</Text> */}
        <Text style={styles.title}>Transaction Report</Text>
        {/* Section #1 */}
        <View style={styles.section}>
          <View style={styles.list}>
            <View style={styles.row}>
              <Text>Transaction ID:</Text>
              <Text>{props.transactionId}</Text>
            </View>
            <View style={styles.row}>
              <Text>Appointment ID:</Text>
              <Text>{props.appointmentId}</Text>
            </View>
            <View style={styles.separator} />

            <View style={styles.row}>
              <Text>Doctor Name:</Text>
              <Text>{props.doctorName}</Text>
            </View>
            <View style={styles.row}>
              <Text>Doctor Field:</Text>
              <Text>{props.doctorField}</Text>
            </View>
            <View style={styles.row}>
              <Text>Doctor Type:</Text>
              <Text>{props.doctorType}</Text>
            </View>
            <View style={styles.separator} />
            <View style={styles.row}>
              <Text>Patient Name:</Text>
              <Text>{props.patientName}</Text>
            </View>
            <View style={styles.row}>
              <Text>Patient Phone:</Text>
              <Text>
                {props.patientPhone.replace(
                  /(\d{4})(\d{3})(\d{4})/,
                  "$1 $2 $3"
                )}
              </Text>
            </View>
            <View style={styles.separator} />
            <View style={styles.row}>
              <Text>Transaction Amount:</Text>
              <Text>
                {props.transactionAmount.toLocaleString()}$ (
                {(
                  Number(props.transactionAmount) * Number(currency)
                ).toLocaleString("en", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}{" "}
                IQD)
              </Text>
            </View>
            <View style={styles.row}>
              <Text>Transaction Type:</Text>
              <Text>{props.transactionType}</Text>
            </View>
            <View style={styles.row}>
              <Text>Transaction Date:</Text>
              <Text>
                {format(
                  new Date(props.transactionDate),
                  "hh:mm a - dd/MM/yyyy"
                )}
              </Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}

// Create styles
const styles = StyleSheet.create({
  page: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#F4F4F5",
    fontSize: 12,
    padding: 30,
  },
  image: {
    width: 50,
    height: 50,
    objectFit: "cover",
  },
  header: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 10,
    color: "#27272A",
  },
  title: {
    fontSize: 28,
    textAlign: "center",
    marginBottom: 10,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: 15,
  },
  row: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
  },
  separator: {
    borderBottom: "1px solid #000",
  },
});

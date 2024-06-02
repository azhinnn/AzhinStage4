import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { EdgeStoreProvider } from "@/lib/edgestore";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Clinc",
  description: "Clinc Managment System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(poppins.className)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          disableTransitionOnChange>
          <EdgeStoreProvider>{children}</EdgeStoreProvider>
        </ThemeProvider>
        <Toaster richColors />
      </body>
    </html>
  );
}

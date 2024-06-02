import "../globals.css";
import Header from "@/components/global/header";
import Footer from "@/components/global/footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen justify-between">
      <Header />
      {children}
      <Footer />
    </div>
  );
}

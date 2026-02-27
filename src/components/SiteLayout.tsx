import Header from "./Header";
import Footer from "./Footer";
import WhatsAppFloat from "./WhatsAppFloat";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}

import DrBen from "./pages/DrBen";
import Header from "./components/Header";
import Footer from "./components/Footer";
import WhatsAppFloat from "./components/WhatsAppFloat";
import { CookieBanner } from "./components/CookieBanner";

export default function App() {
  return (
    <>
      <Header />
      <main>
        <DrBen />
      </main>
      <Footer />
      <WhatsAppFloat />
      <CookieBanner />
    </>
  );
}

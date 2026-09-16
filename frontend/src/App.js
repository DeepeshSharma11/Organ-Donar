import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/lib/auth";
import { I18nProvider } from "@/lib/i18n";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import About from "@/pages/About";
import FAQ from "@/pages/FAQ";
import Contact from "@/pages/Contact";
import Register from "@/pages/Register";
import Login from "@/pages/Login";
import DonorDashboard from "@/pages/DonorDashboard";
import HospitalPortal from "@/pages/HospitalPortal";
import AdminPanel from "@/pages/AdminPanel";
import Waitlist from "@/pages/Waitlist";
import "@/index.css";

function App() {
  return (
    <I18nProvider>
      <AuthProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/donor" element={<DonorDashboard />} />
              <Route path="/hospital" element={<HospitalPortal />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/waitlist" element={<Waitlist />} />
            </Routes>
          </Layout>
          <Toaster position="top-right" richColors />
        </BrowserRouter>
      </AuthProvider>
    </I18nProvider>
  );
}

export default App;

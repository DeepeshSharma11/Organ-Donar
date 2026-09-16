import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import api from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { Heart, Building2, ShieldCheck } from "lucide-react";

export default function Login() {
  const [tab, setTab] = useState("donor");
  return (
    <div className="min-h-[80vh] grid lg:grid-cols-2">
      <div
        className="hidden lg:block relative"
        style={{
          backgroundImage: "url(https://images.unsplash.com/photo-1719934398679-d764c1410770?w=1400&q=80)",
          backgroundSize: "cover", backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-[#1C2220]/55" />
        <div className="absolute inset-0 p-12 flex flex-col justify-between text-white">
          <div className="font-serif text-3xl leading-tight">A network of hospitals, donors, and one transparent queue.</div>
          <div className="text-sm opacity-80 max-w-md">
            "I checked the waitlist every day. The day my name moved up was the day I started believing again." <br />
            — Sneha, kidney recipient, Bengaluru
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <h1 className="font-serif text-4xl text-[#1C2220]">Welcome back</h1>
          <p className="text-[#4A5D54] mt-2">Choose your role to continue.</p>

          <Tabs value={tab} onValueChange={setTab} className="mt-8">
            <TabsList className="grid grid-cols-3 bg-[#EDF0EB]" data-testid="login-tabs">
              <TabsTrigger value="donor" data-testid="tab-donor"><Heart className="w-3.5 h-3.5 mr-1.5" />Donor</TabsTrigger>
              <TabsTrigger value="hospital" data-testid="tab-hospital"><Building2 className="w-3.5 h-3.5 mr-1.5" />Hospital</TabsTrigger>
              <TabsTrigger value="admin" data-testid="tab-admin"><ShieldCheck className="w-3.5 h-3.5 mr-1.5" />Admin</TabsTrigger>
            </TabsList>

            <TabsContent value="donor" className="mt-6"><LoginForm role="donor" endpoint="/auth/login" redirect="/donor" hint="Demo: donor@focitech.in / Admin@123" /></TabsContent>
            <TabsContent value="hospital" className="mt-6"><LoginForm role="hospital" endpoint="/hospital/login" redirect="/hospital" hint="Demo: aiims@organbridge.in / Hospital@123" /></TabsContent>
            <TabsContent value="admin" className="mt-6"><LoginForm role="admin" endpoint="/admin/login" redirect="/admin" hint="Demo: admin@organbridge.in / Admin@123" /></TabsContent>
          </Tabs>

          <div className="text-center mt-8 text-sm text-[#4A5D54]">
            New here? <Link to="/register" className="text-[#2A5A4A] font-semibold hover:underline">Pledge in 2 minutes →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoginForm({ role, endpoint, redirect, hint }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post(endpoint, { email, password });
      login(data.token, role, data.donor || data.hospital || data.admin);
      toast.success(`Signed in as ${role}`);
      navigate(redirect);
    } catch (err) {
      toast.error(err.response?.data?.detail || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4" data-testid={`form-login-${role}`}>
      <div>
        <Label className="text-xs uppercase tracking-[0.2em] text-[#4A5D54]">Email</Label>
        <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2" data-testid={`input-email-${role}`} />
      </div>
      <div>
        <Label className="text-xs uppercase tracking-[0.2em] text-[#4A5D54]">Password</Label>
        <Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-2" data-testid={`input-password-${role}`} />
      </div>
      {hint && <p className="text-xs text-[#4A5D54] bg-[#EDF0EB] p-3 rounded-lg">{hint}</p>}
      <Button type="submit" disabled={loading} className="w-full btn-primary rounded-full py-6" data-testid={`btn-login-${role}`}>
        {loading ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
}

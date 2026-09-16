import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import api from "@/lib/api";
import { useAuth } from "@/lib/auth";

const ORGANS = ["Heart", "Liver", "Kidneys", "Lungs", "Pancreas", "Cornea", "Skin", "Bone"];
const BLOOD = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const STATES = ["Andhra Pradesh","Assam","Bihar","Chhattisgarh","Delhi","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Odisha","Punjab","Rajasthan","Tamil Nadu","Telangana","Uttar Pradesh","Uttarakhand","West Bengal"];

const steps = ["Personal", "Identity", "Address", "Nominee", "Preferences", "Account"];

export default function Register() {
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    full_name: "", gender: "", dob: "", blood_group: "",
    aadhaar: "", mobile: "",
    address: "", state: "", district: "", pincode: "",
    nominee_name: "", nominee_relation: "", nominee_mobile: "",
    organs: ["all"], email: "", password: "",
  });
  const navigate = useNavigate();
  const { login } = useAuth();

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const toggleOrgan = (o) => {
    setForm((f) => {
      let next = f.organs.filter((x) => x !== "all");
      if (next.includes(o)) next = next.filter((x) => x !== o);
      else next = [...next, o];
      if (next.length === 0) next = ["all"];
      return { ...f, organs: next };
    });
  };

  const stepValid = () => {
    if (step === 0) return form.full_name && form.gender && form.dob && form.blood_group;
    if (step === 1) return /^\d{12}$/.test(form.aadhaar) && /^\d{10}$/.test(form.mobile);
    if (step === 2) return form.address && form.state && form.district && /^\d{6}$/.test(form.pincode);
    if (step === 3) return form.nominee_name && form.nominee_relation && /^\d{10}$/.test(form.nominee_mobile);
    if (step === 4) return form.organs.length > 0;
    if (step === 5) return /\S+@\S+\.\S+/.test(form.email) && form.password.length >= 6;
    return true;
  };

  const next = () => {
    if (!stepValid()) { toast.error("Please complete this step correctly."); return; }
    setStep((s) => Math.min(s + 1, steps.length - 1));
  };

  const submit = async () => {
    if (!stepValid()) { toast.error("Please complete this step correctly."); return; }
    setSubmitting(true);
    try {
      const { data } = await api.post("/auth/register", form);
      login(data.token, "donor", data.donor);
      toast.success("Pledge successful · your Donor Card is ready");
      navigate("/donor");
    } catch (e) {
      toast.error(e.response?.data?.detail || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 lg:px-10 py-12 lg:py-20">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EDF0EB] text-xs uppercase tracking-[0.25em] text-[#2A5A4A]">
          <Heart className="w-3 h-3" fill="#E06D53" strokeWidth={0} color="#E06D53" />
          Donor Pledge · 2 minutes
        </div>
        <h1 className="font-serif text-4xl lg:text-5xl tracking-tighter mt-5 text-[#1C2220]">Pledge your organs</h1>
        <p className="text-[#4A5D54] mt-2">Your decision today can give 8 people tomorrow.</p>
      </div>

      {/* Stepper */}
      <div className="flex items-center justify-between mb-10" data-testid="register-stepper">
        {steps.map((s, i) => (
          <div key={s} className="flex-1 flex items-center">
            <div className="flex flex-col items-center flex-1">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold border-2 ${
                i < step ? "bg-[#2A5A4A] text-white border-[#2A5A4A]" :
                i === step ? "bg-white text-[#2A5A4A] border-[#2A5A4A]" :
                "bg-white text-[#4A5D54] border-[#D3D9D5]"
              }`}>
                {i < step ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
              </div>
              <div className={`mt-2 text-[10px] uppercase tracking-[0.2em] ${i === step ? "text-[#2A5A4A] font-semibold" : "text-[#4A5D54]"}`}>{s}</div>
            </div>
            {i < steps.length - 1 && <div className={`h-px flex-1 ${i < step ? "bg-[#2A5A4A]" : "bg-[#D3D9D5]"}`} />}
          </div>
        ))}
      </div>

      <div className="bg-white border border-[#D3D9D5] rounded-2xl p-8 lg:p-10">
        {/* Step 0 */}
        {step === 0 && (
          <div className="grid sm:grid-cols-2 gap-5" data-testid="step-personal">
            <Field label="Full Name">
              <Input data-testid="input-fullname" value={form.full_name} onChange={(e) => set("full_name", e.target.value)} placeholder="As per Aadhaar" />
            </Field>
            <Field label="Gender">
              <Select value={form.gender} onValueChange={(v) => set("gender", v)}>
                <SelectTrigger data-testid="select-gender"><SelectValue placeholder="Select gender" /></SelectTrigger>
                <SelectContent><SelectItem value="Male">Male</SelectItem><SelectItem value="Female">Female</SelectItem><SelectItem value="Other">Other</SelectItem></SelectContent>
              </Select>
            </Field>
            <Field label="Date of Birth">
              <Input data-testid="input-dob" type="date" value={form.dob} onChange={(e) => set("dob", e.target.value)} />
            </Field>
            <Field label="Blood Group">
              <Select value={form.blood_group} onValueChange={(v) => set("blood_group", v)}>
                <SelectTrigger data-testid="select-blood"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>{BLOOD.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
          </div>
        )}

        {/* Step 1 */}
        {step === 1 && (
          <div className="grid sm:grid-cols-2 gap-5" data-testid="step-identity">
            <Field label="Aadhaar Number (12 digits)">
              <Input data-testid="input-aadhaar" maxLength={12} value={form.aadhaar} onChange={(e) => set("aadhaar", e.target.value.replace(/\D/g, ""))} placeholder="XXXX XXXX XXXX" />
              <p className="text-xs text-[#4A5D54] mt-1.5">Only the last 4 digits will be visible on your donor card.</p>
            </Field>
            <Field label="Mobile (linked to Aadhaar)">
              <Input data-testid="input-mobile" maxLength={10} value={form.mobile} onChange={(e) => set("mobile", e.target.value.replace(/\D/g, ""))} placeholder="10-digit mobile" />
            </Field>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="grid sm:grid-cols-2 gap-5" data-testid="step-address">
            <Field label="Current Address" className="sm:col-span-2">
              <Textarea data-testid="input-address" rows={3} value={form.address} onChange={(e) => set("address", e.target.value)} />
            </Field>
            <Field label="State">
              <Select value={form.state} onValueChange={(v) => set("state", v)}>
                <SelectTrigger data-testid="select-state"><SelectValue placeholder="Select state" /></SelectTrigger>
                <SelectContent className="max-h-72">{STATES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
            <Field label="District">
              <Input data-testid="input-district" value={form.district} onChange={(e) => set("district", e.target.value)} />
            </Field>
            <Field label="Pin Code">
              <Input data-testid="input-pincode" maxLength={6} value={form.pincode} onChange={(e) => set("pincode", e.target.value.replace(/\D/g, ""))} />
            </Field>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className="grid sm:grid-cols-2 gap-5" data-testid="step-nominee">
            <Field label="Nominee Full Name">
              <Input data-testid="input-nominee-name" value={form.nominee_name} onChange={(e) => set("nominee_name", e.target.value)} />
            </Field>
            <Field label="Relationship">
              <Select value={form.nominee_relation} onValueChange={(v) => set("nominee_relation", v)}>
                <SelectTrigger data-testid="select-nominee-relation"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>{["Father","Mother","Spouse","Sibling","Child","Other"].map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
            <Field label="Nominee Mobile">
              <Input data-testid="input-nominee-mobile" maxLength={10} value={form.nominee_mobile} onChange={(e) => set("nominee_mobile", e.target.value.replace(/\D/g, ""))} />
            </Field>
            <div className="sm:col-span-2 text-xs text-[#4A5D54] bg-[#EDF0EB] p-4 rounded-lg">
              Why this matters: Indian law requires your family's consent at the time of death.
              The clearer your wish is to them, the more likely they will honour it.
            </div>
          </div>
        )}

        {/* Step 4 */}
        {step === 4 && (
          <div data-testid="step-organs">
            <Label className="text-xs uppercase tracking-[0.2em] text-[#4A5D54]">Donation Preferences</Label>
            <div className="mt-4 flex items-center gap-3">
              <Checkbox
                data-testid="checkbox-all-organs"
                checked={form.organs.includes("all")}
                onCheckedChange={(c) => setForm((f) => ({ ...f, organs: c ? ["all"] : [] }))}
              />
              <span className="font-serif text-xl text-[#1C2220]">I pledge all organs & tissues</span>
            </div>
            <div className="border-t border-[#D3D9D5] my-6" />
            <Label className="text-xs uppercase tracking-[0.2em] text-[#4A5D54]">Or select specific organs</Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
              {ORGANS.map((o) => (
                <label key={o} className={`flex items-center gap-2.5 p-3 rounded-lg border cursor-pointer ${form.organs.includes(o) ? "border-[#2A5A4A] bg-[#EDF0EB]" : "border-[#D3D9D5] bg-white hover:border-[#2A5A4A]/40"}`}>
                  <Checkbox data-testid={`checkbox-organ-${o}`} checked={form.organs.includes(o)} onCheckedChange={() => toggleOrgan(o)} />
                  <span className="text-sm font-medium">{o}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Step 5 */}
        {step === 5 && (
          <div className="grid sm:grid-cols-2 gap-5" data-testid="step-account">
            <Field label="Email">
              <Input data-testid="input-email" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
            </Field>
            <Field label="Password (min 6 chars)">
              <Input data-testid="input-password" type="password" value={form.password} onChange={(e) => set("password", e.target.value)} />
            </Field>
            <div className="sm:col-span-2 bg-[#2A5A4A] text-white p-5 rounded-xl">
              <div className="font-serif text-xl">Almost done.</div>
              <div className="text-sm opacity-90 mt-1">Click "Pledge & generate card" to receive your digital donor card instantly.</div>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="mt-10 flex items-center justify-between">
          <Button
            variant="ghost"
            disabled={step === 0}
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            data-testid="register-back"
          >
            <ChevronLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          {step < steps.length - 1 ? (
            <Button onClick={next} className="btn-primary rounded-full px-6" data-testid="register-next">
              Next <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button onClick={submit} disabled={submitting} className="btn-accent rounded-full px-6" data-testid="register-submit">
              {submitting ? "Pledging..." : "Pledge & generate card"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, children, className = "" }) {
  return (
    <div className={className}>
      <Label className="text-xs uppercase tracking-[0.2em] text-[#4A5D54]">{label}</Label>
      <div className="mt-2">{children}</div>
    </div>
  );
}

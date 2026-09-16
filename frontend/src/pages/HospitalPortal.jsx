import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, Plus, Activity } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import api from "@/lib/api";
import { useAuth } from "@/lib/auth";
import GreenCorridor from "@/components/GreenCorridor";

const BLOOD = ["A+","A-","B+","B-","AB+","AB-","O+","O-"];
const ORGANS = ["Heart","Liver","Kidney","Lung","Cornea","Pancreas"];

export default function HospitalPortal() {
  const { token, role, user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("waitlist");
  const [waitlist, setWaitlist] = useState([]);
  const [myPatients, setMyPatients] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!token || role !== "hospital") { navigate("/login"); return; }
    refresh();
    // eslint-disable-next-line
  }, [token, role]);

  const refresh = async () => {
    try {
      const [w, m] = await Promise.all([
        api.get("/hospital/waitlist"),
        api.get("/hospital/patients"),
      ]);
      setWaitlist(w.data);
      setMyPatients(m.data);
    } catch {}
  };

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12 lg:py-16">
      <div className="grid lg:grid-cols-12 gap-8 mb-10">
        <div className="lg:col-span-8">
          <div className="text-xs uppercase tracking-[0.25em] text-[#E06D53]">Hospital Portal · Secure</div>
          <h1 className="font-serif text-4xl lg:text-5xl text-[#1C2220] mt-2 leading-tight">
            <Building2 className="w-8 h-8 inline mr-3 text-[#2A5A4A]" />
            {user?.name || "Your hospital"}
          </h1>
          <p className="text-[#4A5D54] mt-3">Manage your patient queue, view the national waitlist, and track active corridors.</p>
        </div>
        <div className="lg:col-span-4 grid grid-cols-2 gap-3">
          <Stat label="Your patients" value={myPatients.length} accent="#2A5A4A" />
          <Stat label="National queue" value={waitlist.length} accent="#E06D53" />
        </div>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <TabsList className="bg-[#EDF0EB]" data-testid="hospital-tabs">
            <TabsTrigger value="waitlist" data-testid="tab-h-waitlist">National Waitlist</TabsTrigger>
            <TabsTrigger value="mine" data-testid="tab-h-mine">My Patients</TabsTrigger>
            <TabsTrigger value="corridor" data-testid="tab-h-corridor">Green Corridor</TabsTrigger>
          </TabsList>
          <AddPatientDialog open={open} setOpen={setOpen} onAdded={refresh} />
        </div>

        <TabsContent value="waitlist" className="mt-6">
          <PatientTable items={waitlist} testId="hospital-waitlist-table" />
        </TabsContent>
        <TabsContent value="mine" className="mt-6">
          <PatientTable items={myPatients} testId="hospital-mine-table" />
        </TabsContent>
        <TabsContent value="corridor" className="mt-6">
          <div className="bg-white border border-[#D3D9D5] rounded-2xl p-6 lg:p-10">
            <GreenCorridor />
            <div className="mt-6 p-4 bg-[#EDF0EB] rounded-lg text-sm text-[#1C2220]">
              <span className="font-semibold">Live: </span>
              Auto-alert sent to State Police Control Room to clear traffic between source &
              destination hospitals. ETA updated every 60s.
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Stat({ label, value, accent }) {
  return (
    <div className="p-5 rounded-xl bg-white border border-[#D3D9D5]">
      <div className="text-xs uppercase tracking-[0.2em] text-[#4A5D54]">{label}</div>
      <div className="font-serif text-3xl mt-1" style={{ color: accent }}>{value}</div>
    </div>
  );
}

function PatientTable({ items, testId }) {
  const urgencyColor = (u) => u >= 5 ? "bg-[#E06D53] text-white" : u >= 4 ? "bg-[#D4A017] text-white" : "bg-[#2A5A4A] text-white";
  if (items.length === 0) return <div className="p-10 text-center text-[#4A5D54] bg-white border border-[#D3D9D5] rounded-2xl">No patients yet.</div>;
  return (
    <div className="bg-white border border-[#D3D9D5] rounded-2xl overflow-hidden">
      <Table data-testid={testId}>
        <TableHeader>
          <TableRow className="bg-[#EDF0EB]">
            <TableHead>Queue ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Organ</TableHead>
            <TableHead>Blood</TableHead>
            <TableHead>Age</TableHead>
            <TableHead>State</TableHead>
            <TableHead className="text-right">Urgency</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((p) => (
            <TableRow key={p.queue_id} data-testid={`patient-row-${p.queue_id}`}>
              <TableCell className="font-mono text-xs">{p.queue_id}</TableCell>
              <TableCell className="font-medium">{p.full_name}</TableCell>
              <TableCell><Activity className="w-3.5 h-3.5 inline mr-1.5 text-[#2A5A4A]" />{p.organ_needed}</TableCell>
              <TableCell>{p.blood_group}</TableCell>
              <TableCell>{p.age}</TableCell>
              <TableCell>{p.state}</TableCell>
              <TableCell className="text-right">
                <Badge className={`${urgencyColor(p.urgency)} rounded-full`}>{p.urgency}/5</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function AddPatientDialog({ open, setOpen, onAdded }) {
  const [form, setForm] = useState({ full_name: "", gender: "Male", age: "", blood_group: "", organ_needed: "", urgency: "3", state: "", district: "", notes: "" });
  const [loading, setLoading] = useState(false);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async () => {
    setLoading(true);
    try {
      await api.post("/hospital/patients", { ...form, age: parseInt(form.age || "0"), urgency: parseInt(form.urgency) });
      toast.success("Patient added to the national waitlist");
      setOpen(false);
      setForm({ full_name: "", gender: "Male", age: "", blood_group: "", organ_needed: "", urgency: "3", state: "", district: "", notes: "" });
      onAdded();
    } catch (e) {
      toast.error(e.response?.data?.detail || "Failed to add patient");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="btn-accent rounded-full" data-testid="btn-add-patient">
          <Plus className="w-4 h-4 mr-1.5" /> Add patient
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl bg-white" data-testid="add-patient-dialog">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">Register new patient on waitlist</DialogTitle>
        </DialogHeader>
        <div className="grid sm:grid-cols-2 gap-4 mt-2">
          <Field label="Full Name"><Input data-testid="ap-name" value={form.full_name} onChange={(e) => set("full_name", e.target.value)} /></Field>
          <Field label="Age"><Input data-testid="ap-age" type="number" value={form.age} onChange={(e) => set("age", e.target.value)} /></Field>
          <Field label="Gender">
            <Select value={form.gender} onValueChange={(v) => set("gender", v)}>
              <SelectTrigger data-testid="ap-gender"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="Male">Male</SelectItem><SelectItem value="Female">Female</SelectItem><SelectItem value="Other">Other</SelectItem></SelectContent>
            </Select>
          </Field>
          <Field label="Blood Group">
            <Select value={form.blood_group} onValueChange={(v) => set("blood_group", v)}>
              <SelectTrigger data-testid="ap-blood"><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>{BLOOD.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <Field label="Organ Needed">
            <Select value={form.organ_needed} onValueChange={(v) => set("organ_needed", v)}>
              <SelectTrigger data-testid="ap-organ"><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>{ORGANS.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <Field label="Urgency (1-5)">
            <Select value={form.urgency} onValueChange={(v) => set("urgency", v)}>
              <SelectTrigger data-testid="ap-urgency"><SelectValue /></SelectTrigger>
              <SelectContent>{[1,2,3,4,5].map(n => <SelectItem key={n} value={`${n}`}>{n}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <Field label="State"><Input data-testid="ap-state" value={form.state} onChange={(e) => set("state", e.target.value)} /></Field>
          <Field label="District"><Input data-testid="ap-district" value={form.district} onChange={(e) => set("district", e.target.value)} /></Field>
          <Field label="Notes" className="sm:col-span-2"><Textarea data-testid="ap-notes" rows={2} value={form.notes} onChange={(e) => set("notes", e.target.value)} /></Field>
        </div>
        <div className="flex justify-end gap-3 mt-4">
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={submit} disabled={loading} className="btn-primary rounded-full" data-testid="ap-submit">
            {loading ? "Adding…" : "Add to waitlist"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children, className = "" }) {
  return (
    <div className={className}>
      <Label className="text-xs uppercase tracking-[0.2em] text-[#4A5D54]">{label}</Label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

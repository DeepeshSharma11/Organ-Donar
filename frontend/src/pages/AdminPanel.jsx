import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Users, Building2, ListChecks, Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import api from "@/lib/api";
import { useAuth } from "@/lib/auth";

export default function AdminPanel() {
  const { token, role } = useAuth();
  const navigate = useNavigate();
  const [donors, setDonors] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [patients, setPatients] = useState([]);
  const [openH, setOpenH] = useState(false);

  useEffect(() => {
    if (!token || role !== "admin") { navigate("/login"); return; }
    refresh();
    // eslint-disable-next-line
  }, [token, role]);

  const refresh = async () => {
    try {
      const [d, h, p] = await Promise.all([
        api.get("/admin/donors"),
        api.get("/admin/hospitals"),
        api.get("/admin/patients"),
      ]);
      setDonors(d.data);
      setHospitals(h.data);
      setPatients(p.data);
    } catch {}
  };

  const verify = async (id) => {
    try {
      await api.put(`/admin/donors/${id}/verify`);
      toast.success("Donor verified");
      refresh();
    } catch { toast.error("Failed"); }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12 lg:py-16">
      <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
        <div>
          <div className="text-xs uppercase tracking-[0.25em] text-[#E06D53]">Admin Control Room</div>
          <h1 className="font-serif text-4xl lg:text-5xl text-[#1C2220] mt-2 leading-tight">
            <ShieldCheck className="w-8 h-8 inline mr-3 text-[#2A5A4A]" />
            System overview
          </h1>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-10">
        <Stat icon={Users} label="Donor Pledges" value={donors.length} />
        <Stat icon={Building2} label="Hospitals" value={hospitals.length} />
        <Stat icon={ListChecks} label="On Waitlist" value={patients.filter(p => p.status === "waiting").length} />
      </div>

      <Tabs defaultValue="donors">
        <TabsList className="bg-[#EDF0EB]" data-testid="admin-tabs">
          <TabsTrigger value="donors" data-testid="admin-tab-donors">Donors</TabsTrigger>
          <TabsTrigger value="hospitals" data-testid="admin-tab-hospitals">Hospitals</TabsTrigger>
          <TabsTrigger value="patients" data-testid="admin-tab-patients">Patients</TabsTrigger>
        </TabsList>

        <TabsContent value="donors" className="mt-6">
          <div className="bg-white border border-[#D3D9D5] rounded-2xl overflow-hidden">
            <Table data-testid="admin-donors-table">
              <TableHeader>
                <TableRow className="bg-[#EDF0EB]">
                  <TableHead>Donor Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Blood</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {donors.length === 0 ? (
                  <TableRow><TableCell colSpan={6} className="text-center text-[#4A5D54] py-8">No donors yet.</TableCell></TableRow>
                ) : donors.map((d) => (
                  <TableRow key={d.id} data-testid={`admin-donor-${d.donor_code}`}>
                    <TableCell className="font-mono text-xs">{d.donor_code}</TableCell>
                    <TableCell className="font-medium">{d.full_name}</TableCell>
                    <TableCell>{d.blood_group}</TableCell>
                    <TableCell>{d.state}</TableCell>
                    <TableCell><Badge className={d.status === "verified" ? "bg-[#2D7A5A] text-white" : "bg-[#EDF0EB] text-[#1C2220]"}>{d.status}</Badge></TableCell>
                    <TableCell className="text-right">
                      {d.status !== "verified" && (
                        <Button size="sm" variant="outline" onClick={() => verify(d.id)} data-testid={`btn-verify-${d.donor_code}`}>Verify</Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="hospitals" className="mt-6">
          <div className="flex justify-end mb-3">
            <AddHospitalDialog open={openH} setOpen={setOpenH} onAdded={refresh} />
          </div>
          <div className="bg-white border border-[#D3D9D5] rounded-2xl overflow-hidden">
            <Table data-testid="admin-hospitals-table">
              <TableHeader>
                <TableRow className="bg-[#EDF0EB]">
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Verified</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hospitals.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="text-center text-[#4A5D54] py-8">No hospitals yet.</TableCell></TableRow>
                ) : hospitals.map((h) => (
                  <TableRow key={h.id}>
                    <TableCell className="font-medium">{h.name}</TableCell>
                    <TableCell className="capitalize">{h.h_type}</TableCell>
                    <TableCell>{h.state}</TableCell>
                    <TableCell>{h.contact}</TableCell>
                    <TableCell>{h.verified ? <Badge className="bg-[#2D7A5A] text-white">Verified</Badge> : <Badge>Pending</Badge>}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="patients" className="mt-6">
          <div className="bg-white border border-[#D3D9D5] rounded-2xl overflow-hidden">
            <Table data-testid="admin-patients-table">
              <TableHeader>
                <TableRow className="bg-[#EDF0EB]">
                  <TableHead>Queue ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Organ</TableHead>
                  <TableHead>Blood</TableHead>
                  <TableHead>Urgency</TableHead>
                  <TableHead>State</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patients.length === 0 ? (
                  <TableRow><TableCell colSpan={6} className="text-center text-[#4A5D54] py-8">No patients yet.</TableCell></TableRow>
                ) : patients.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-mono text-xs">{p.queue_id}</TableCell>
                    <TableCell className="font-medium">{p.full_name}</TableCell>
                    <TableCell>{p.organ_needed}</TableCell>
                    <TableCell>{p.blood_group}</TableCell>
                    <TableCell>{p.urgency}/5</TableCell>
                    <TableCell>{p.state}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Stat({ icon: Icon, label, value }) {
  return (
    <div className="p-6 rounded-2xl bg-white border border-[#D3D9D5]">
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#4A5D54]">
        <Icon className="w-4 h-4 text-[#2A5A4A]" /> {label}
      </div>
      <div className="font-serif text-4xl text-[#1C2220] mt-2">{value}</div>
    </div>
  );
}

function AddHospitalDialog({ open, setOpen, onAdded }) {
  const [form, setForm] = useState({ name: "", email: "", password: "", h_type: "government", state: "", district: "", address: "", contact: "" });
  const [loading, setLoading] = useState(false);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async () => {
    setLoading(true);
    try {
      await api.post("/admin/hospitals", form);
      toast.success("Hospital added");
      setOpen(false);
      onAdded();
    } catch (e) {
      toast.error(e.response?.data?.detail || "Failed");
    } finally { setLoading(false); }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="btn-accent rounded-full" data-testid="btn-add-hospital"><Plus className="w-4 h-4 mr-1.5" />Add hospital</Button>
      </DialogTrigger>
      <DialogContent className="bg-white max-w-2xl" data-testid="add-hospital-dialog">
        <DialogHeader><DialogTitle className="font-serif text-2xl">Register a hospital</DialogTitle></DialogHeader>
        <div className="grid sm:grid-cols-2 gap-4">
          {["name","email","password","h_type","state","district","contact","address"].map((k) => (
            <div key={k} className={k === "address" ? "sm:col-span-2" : ""}>
              <Label className="text-xs uppercase tracking-[0.2em] text-[#4A5D54]">{k.replace("_", " ")}</Label>
              <Input
                data-testid={`ah-${k}`}
                type={k === "password" ? "password" : "text"}
                value={form[k]}
                onChange={(e) => set(k, e.target.value)}
                className="mt-1.5"
              />
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-3 mt-4">
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={submit} disabled={loading} className="btn-primary rounded-full" data-testid="ah-submit">{loading ? "Saving…" : "Save"}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

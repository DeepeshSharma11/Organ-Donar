import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Download, Heart, Share2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import api from "@/lib/api";
import { useAuth } from "@/lib/auth";
import DonorCard from "@/components/DonorCard";

export default function DonorDashboard() {
  const { token, role } = useAuth();
  const [donor, setDonor] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || role !== "donor") { navigate("/login"); return; }
    api.get("/donors/me").then((r) => setDonor(r.data)).catch(() => navigate("/login"));
  }, [token, role, navigate]);

  if (!donor) return <div className="max-w-7xl mx-auto px-6 py-20 text-center text-[#4A5D54]">Loading your card…</div>;

  const share = async () => {
    const text = `I have pledged my organs through OrganBridge India. My donor ID is ${donor.donor_code}. Will you?`;
    if (navigator.share) {
      try { await navigator.share({ title: "My organ pledge", text, url: window.location.origin }); }
      catch {}
    } else {
      await navigator.clipboard.writeText(text + " " + window.location.origin);
      toast.success("Copied — share with your loved ones");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12 lg:py-16">
      <div className="grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5">
          <div className="text-xs uppercase tracking-[0.25em] text-[#E06D53]">Your Digital Donor Card</div>
          <h1 className="font-serif text-4xl lg:text-5xl text-[#1C2220] mt-3 leading-tight">
            Thank you, <span className="italic">{donor.full_name.split(" ")[0]}</span>.
          </h1>
          <p className="text-[#4A5D54] mt-4 leading-relaxed">
            Your pledge has been registered. Download your card, share it with your nominee,
            and most importantly — tell your family today.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button onClick={() => window.print()} className="btn-primary rounded-full px-5" data-testid="btn-download-card">
              <Download className="w-4 h-4 mr-2" /> Download / Print
            </Button>
            <Button onClick={share} variant="outline" className="rounded-full px-5 border-[#D3D9D5]" data-testid="btn-share-card">
              <Share2 className="w-4 h-4 mr-2" /> Share my pledge
            </Button>
          </div>

          <div className="mt-10 space-y-3">
            <Info label="Donor ID" value={donor.donor_code} />
            <Info label="State" value={`${donor.district}, ${donor.state}`} />
            <Info label="Nominee" value={`${donor.nominee_name} (${donor.nominee_relation})`} />
            <Info label="Pledged" value={donor.organs?.includes("all") ? "All Organs & Tissues" : donor.organs?.join(", ")} />
          </div>

          <div className="mt-8 p-5 rounded-xl bg-[#EDF0EB] border border-[#D3D9D5]">
            <FileText className="w-4 h-4 text-[#2A5A4A] inline mr-2" />
            <span className="text-sm text-[#1C2220] font-medium">Tell your family</span>
            <p className="text-sm text-[#4A5D54] mt-1.5 leading-relaxed">
              Indian law requires family consent at the time of donation.
              A 5-minute conversation today is the single most powerful thing you can do for your pledge.
            </p>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="sticky top-24">
            <DonorCard donor={donor} />
            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-[#4A5D54]">
              <Heart className="w-3 h-3 text-[#E06D53]" fill="#E06D53" strokeWidth={0} />
              Verified by OrganBridge · Linked to Aadhaar XXXX-XXXX-{donor.aadhaar_last4}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="flex items-baseline justify-between border-b border-[#D3D9D5] pb-2">
      <span className="text-xs uppercase tracking-[0.2em] text-[#4A5D54]">{label}</span>
      <span className="font-medium text-[#1C2220] text-right">{value}</span>
    </div>
  );
}

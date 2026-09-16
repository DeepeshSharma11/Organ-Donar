import { Heart, ShieldCheck } from "lucide-react";

export default function DonorCard({ donor }) {
  if (!donor) return null;
  const qrData = encodeURIComponent(JSON.stringify({
    id: donor.donor_code,
    name: donor.full_name,
    blood: donor.blood_group,
    organs: donor.organs,
  }));
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&margin=2&data=${qrData}&color=2A5A4A&bgcolor=F9F7F3`;

  const organsText = (donor.organs || []).includes("all") || (donor.organs || []).length === 0
    ? "All Organs & Tissues"
    : donor.organs.join(", ");

  return (
    <div id="print-card" data-testid="donor-card" className="relative max-w-md mx-auto">
      <div className="rounded-2xl overflow-hidden border border-[#D3D9D5] bg-[#F9F7F3] shadow-[0_30px_60px_-30px_rgba(28,34,32,0.25)]">
        <div className="bg-[#2A5A4A] text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center">
              <Heart className="w-4.5 h-4.5 text-white" fill="white" strokeWidth={0} size={18} />
            </div>
            <div>
              <div className="font-serif text-xl leading-none">OrganBridge</div>
              <div className="text-[10px] tracking-[0.3em] uppercase opacity-80">India · Donor Card</div>
            </div>
          </div>
          <ShieldCheck className="w-5 h-5 opacity-90" />
        </div>

        <div className="p-6 grid grid-cols-3 gap-5">
          <div className="col-span-2 space-y-3">
            <div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-[#4A5D54]">Donor</div>
              <div className="font-serif text-2xl text-[#1C2220] leading-tight">{donor.full_name}</div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-[#4A5D54]">Blood</div>
                <div className="font-semibold text-[#E06D53]">{donor.blood_group}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-[#4A5D54]">DOB</div>
                <div className="font-medium">{donor.dob}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-[#4A5D54]">Gender</div>
                <div className="font-medium">{donor.gender}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-[#4A5D54]">Aadhaar</div>
                <div className="font-medium">XXXX-XXXX-{donor.aadhaar_last4}</div>
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-[#4A5D54]">Pledged Organs</div>
              <div className="text-sm font-medium text-[#1C2220]">{organsText}</div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="w-[110px] h-[110px] bg-white rounded-lg border border-[#D3D9D5] p-1.5 flex items-center justify-center overflow-hidden">
              <img src={qrUrl} alt="Donor QR" className="w-full h-full object-contain" />
            </div>
            <div className="text-[9px] uppercase tracking-[0.2em] text-[#4A5D54]">Verify</div>
          </div>
        </div>

        <div className="border-t border-[#D3D9D5] bg-[#EDF0EB] px-6 py-3 flex items-center justify-between text-xs">
          <span className="font-mono text-[#1C2220]">{donor.donor_code}</span>
          <span className="text-[#4A5D54] italic font-serif">"Give twice — life and sight."</span>
        </div>
      </div>
    </div>
  );
}

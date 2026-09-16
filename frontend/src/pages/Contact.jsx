import { Phone, Mail, MapPin, AlertCircle, HeartHandshake } from "lucide-react";

export default function Contact() {
  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 lg:py-24">
      <div className="max-w-3xl">
        <div className="text-xs uppercase tracking-[0.25em] text-[#E06D53] mb-3">Contact & Support</div>
        <h1 className="font-serif text-5xl lg:text-6xl tracking-tighter leading-[0.95] text-[#1C2220]">
          We are here — at any hour.
        </h1>
        <p className="mt-6 text-lg text-[#4A5D54]">
          Whether you have a question about your pledge, need grief counselling after losing a loved one,
          or you are a hospital wanting to join the network — please reach out.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mt-14">
        <div className="p-7 rounded-2xl bg-[#2A5A4A] text-white">
          <AlertCircle className="w-6 h-6" />
          <div className="text-xs uppercase tracking-[0.25em] mt-4 opacity-80">24×7 Helpline</div>
          <div className="font-serif text-3xl mt-1">NOTTO · 1800-11-4770</div>
          <div className="text-sm mt-3 text-white/80">For donor / family / hospital coordination in real time.</div>
        </div>
        <div className="p-7 rounded-2xl bg-white border border-[#D3D9D5]">
          <HeartHandshake className="w-6 h-6 text-[#E06D53]" />
          <div className="text-xs uppercase tracking-[0.25em] mt-4 text-[#4A5D54]">Grief Counselling</div>
          <div className="font-serif text-2xl mt-1 text-[#1C2220]">+91 98765 43210</div>
          <div className="text-sm mt-3 text-[#4A5D54]">Free, confidential support from trained counsellors for donor families.</div>
        </div>
        <div className="p-7 rounded-2xl bg-[#EDF0EB] border border-[#D3D9D5]">
          <Mail className="w-6 h-6 text-[#2A5A4A]" />
          <div className="text-xs uppercase tracking-[0.25em] mt-4 text-[#4A5D54]">Email</div>
          <div className="font-serif text-2xl mt-1 text-[#1C2220]">care@organbridge.in</div>
          <div className="text-sm mt-3 text-[#4A5D54]">For pledge issues, donor card reissue, and partnerships.</div>
        </div>
      </div>

      <div className="mt-14 grid lg:grid-cols-2 gap-8">
        <div className="p-8 bg-white border border-[#D3D9D5] rounded-2xl">
          <MapPin className="w-5 h-5 text-[#2A5A4A]" />
          <div className="font-serif text-2xl mt-3 text-[#1C2220]">Headquarters</div>
          <div className="mt-2 text-[#4A5D54] leading-relaxed">
            OrganBridge Foundation<br />
            4th Floor, Bharat Bhavan, Janpath<br />
            New Delhi — 110001
          </div>
        </div>
        <div className="p-8 bg-white border border-[#D3D9D5] rounded-2xl">
          <Phone className="w-5 h-5 text-[#E06D53]" />
          <div className="font-serif text-2xl mt-3 text-[#1C2220]">Office hours</div>
          <div className="mt-2 text-[#4A5D54] leading-relaxed">
            Mon-Fri · 9:00 to 18:00 IST<br />
            +91 11 2345 6789<br />
            (Emergency coordination is 24×7 via NOTTO helpline above.)
          </div>
        </div>
      </div>
    </div>
  );
}

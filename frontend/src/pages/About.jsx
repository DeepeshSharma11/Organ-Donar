import { Heart, Users, Activity, Eye, Layers } from "lucide-react";

export default function About() {
  const organs = [
    { name: "Heart", icon: Heart, fact: "Viable for 4-6 hours after retrieval" },
    { name: "Liver", icon: Layers, fact: "Can be split between two recipients" },
    { name: "Kidneys", icon: Activity, fact: "Most common transplant — 2 per donor" },
    { name: "Lungs", icon: Activity, fact: "Both lungs can save 1-2 lives" },
    { name: "Eyes / Cornea", icon: Eye, fact: "Restores sight to 2 people" },
    { name: "Pancreas", icon: Layers, fact: "Cures Type-1 diabetes" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 lg:py-24">
      <div className="max-w-3xl">
        <div className="text-xs uppercase tracking-[0.25em] text-[#E06D53] mb-3">About Organ Donation</div>
        <h1 className="font-serif text-5xl lg:text-6xl tracking-tighter leading-[0.95] text-[#1C2220]">
          The most generous thing a human can do — and what really happens.
        </h1>
        <p className="mt-7 text-lg text-[#4A5D54] leading-relaxed">
          There is more misinformation about organ donation in India than almost any other medical topic.
          Let's get a few things clear — calmly, accurately, and without drama.
        </p>
      </div>

      {/* Types of donation */}
      <div className="grid md:grid-cols-2 gap-6 mt-16">
        <div className="p-8 rounded-2xl bg-[#EDF0EB] border border-[#D3D9D5]">
          <Users className="w-6 h-6 text-[#2A5A4A]" />
          <h3 className="font-serif text-3xl mt-4 text-[#1C2220]">Living Donation</h3>
          <p className="text-[#4A5D54] mt-3 leading-relaxed">
            A healthy living person voluntarily donates an organ — most commonly a kidney, or
            a portion of liver — usually to a family member. The body recovers fully.
            All living donations require independent committee approval.
          </p>
        </div>
        <div className="p-8 rounded-2xl bg-[#2A5A4A] text-white">
          <Heart className="w-6 h-6" fill="white" strokeWidth={0} />
          <h3 className="font-serif text-3xl mt-4">Deceased (Brain-Death) Donation</h3>
          <p className="text-white/85 mt-3 leading-relaxed">
            Brain death is the irreversible end of all brain activity — declared only by a panel
            of four independent doctors, none from the transplant team. The heart may still beat
            on a ventilator, but the person is medically and legally dead. Only then is donation
            even discussed with the family.
          </p>
        </div>
      </div>

      {/* Brain death explained */}
      <div className="mt-20 grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-5">
          <div className="text-xs uppercase tracking-[0.25em] text-[#2A5A4A] mb-3">Brain Death, simply</div>
          <h2 className="font-serif text-4xl text-[#1C2220] leading-tight">
            Doctors do not let people die for organs. <br/>
            <span className="italic text-[#E06D53]">They fight to save them first.</span>
          </h2>
        </div>
        <div className="lg:col-span-7 space-y-5 text-[#1C2220]">
          {[
            { t: "1 · Every effort to save life first", d: "Doctors treat the patient with everything they have. The transplant team is never in the same room as the treating team." },
            { t: "2 · Brain death is medically certified", d: "Four senior doctors — including a neurologist and the hospital head — independently confirm brain death twice, six hours apart." },
            { t: "3 · The family is informed gently", d: "Counsellors explain the situation. The family is then asked — without any pressure — about donation." },
            { t: "4 · Allocation is national, not local", d: "If the family consents, the central NOTTO/SOTTO system identifies the most urgent matching patient, anywhere in India." },
          ].map((step) => (
            <div key={step.t} className="border-l-2 border-[#2A5A4A] pl-5">
              <div className="font-serif text-xl">{step.t}</div>
              <div className="text-[#4A5D54] text-sm mt-1.5 leading-relaxed">{step.d}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Organs grid */}
      <div className="mt-24">
        <div className="text-xs uppercase tracking-[0.25em] text-[#E06D53] mb-3">What you can donate</div>
        <h2 className="font-serif text-4xl text-[#1C2220]">One person · up to eight lives · sight for two more.</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
          {organs.map((o) => (
            <div key={o.name} className="p-6 bg-white border border-[#D3D9D5] rounded-2xl hover:border-[#2A5A4A]/40 transition-colors">
              <o.icon className="w-5 h-5 text-[#2A5A4A]" />
              <div className="font-serif text-2xl mt-3 text-[#1C2220]">{o.name}</div>
              <div className="text-sm text-[#4A5D54] mt-1.5">{o.fact}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

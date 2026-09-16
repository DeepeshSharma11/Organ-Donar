import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowUpRight, Heart, Shield, Activity, IdCard, Quote, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import LiveCounter from "@/components/LiveCounter";
import GreenCorridor from "@/components/GreenCorridor";
import { useI18n } from "@/lib/i18n";
import api from "@/lib/api";

export default function Home() {
  const { t } = useI18n();
  const [stats, setStats] = useState({ total_pledges: 0, waiting_patients: 0, partner_hospitals: 0, lives_saved: 0 });

  useEffect(() => {
    api.get("/stats").then((r) => setStats(r.data)).catch(() => {});
  }, []);

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage: "url(https://images.unsplash.com/photo-1607207219455-37c3a0a0f3a7?w=1600&q=80)",
            backgroundSize: "cover", backgroundPosition: "center",
          }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#F9F7F3]/70 to-[#F9F7F3]" aria-hidden />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-10 pt-16 pb-24 lg:pt-24 lg:pb-32 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/70 backdrop-blur border border-[#D3D9D5] text-xs uppercase tracking-[0.25em] text-[#4A5D54] mb-6">
              <Heart className="w-3 h-3 text-[#E06D53]" fill="#E06D53" strokeWidth={0} />
              {t("hero_tag")}
            </div>
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl tracking-tighter leading-[0.95] text-[#1C2220]">
              {t("hero_title").split(".").map((s, i) => (
                <span key={i} className="block">
                  {s.trim()}{i === 0 ? "." : ""}
                </span>
              ))}
            </h1>
            <p className="mt-7 text-lg text-[#4A5D54] leading-relaxed max-w-xl">
              {t("hero_sub")}
            </p>
            <div className="mt-9 flex flex-wrap gap-3 items-center">
              <Link to="/register">
                <Button data-testid="hero-pledge-btn" className="btn-accent rounded-full px-7 py-6 text-base heartbeat">
                  <Heart className="w-4 h-4 mr-2" fill="white" strokeWidth={0} />
                  {t("cta_pledge")}
                </Button>
              </Link>
              <Link to="/waitlist">
                <Button data-testid="hero-waitlist-btn" variant="ghost" className="rounded-full px-6 py-6 text-base text-[#1C2220] hover:bg-[#EDF0EB]">
                  {t("cta_waitlist")} <ArrowUpRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
            </div>
            <div className="mt-9 flex items-center gap-3 text-xs text-[#4A5D54]">
              <Shield className="w-3.5 h-3.5" />
              <span>End-to-end encrypted · Aadhaar verified · No data sold</span>
            </div>
          </div>

          {/* Right hero — small donor card preview */}
          <div className="lg:col-span-5 reveal" style={{ animationDelay: "180ms" }}>
            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl bg-[#EDF0EB]" aria-hidden />
              <div className="relative rounded-2xl overflow-hidden bg-white border border-[#D3D9D5] shadow-[0_30px_60px_-30px_rgba(42,90,74,0.35)]">
                <img
                  src="https://images.unsplash.com/photo-1631558554226-fb65b25aa939?w=900&q=85"
                  alt="Doctor consultation"
                  className="w-full h-72 object-cover"
                />
                <div className="p-5 border-t border-[#D3D9D5]">
                  <div className="text-xs uppercase tracking-[0.25em] text-[#4A5D54]">A real story</div>
                  <div className="mt-2 font-serif text-xl leading-snug text-[#1C2220]">
                    "Ravi's family said yes. Six strangers, including a 4-year-old, are alive today."
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -left-6 bg-[#2A5A4A] text-white rounded-2xl px-5 py-4 shadow-lg">
                <div className="text-[10px] uppercase tracking-[0.25em] opacity-80">Avg. signup time</div>
                <div className="font-serif text-3xl leading-none mt-1">1m 52s</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LIVE STATS */}
      <section className="border-y border-[#D3D9D5] bg-white/60">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { k: "stats_pledges", v: stats.total_pledges, color: "#2A5A4A" },
            { k: "stats_waiting", v: stats.waiting_patients, color: "#E06D53" },
            { k: "stats_hospitals", v: stats.partner_hospitals, color: "#2A5A4A" },
            { k: "stats_saved", v: stats.lives_saved, color: "#2D7A5A" },
          ].map((s) => (
            <div key={s.k} className="text-center md:text-left">
              <div className="font-serif text-4xl lg:text-5xl text-[#1C2220]">
                <LiveCounter value={s.v} duration={1800} />
              </div>
              <div className="text-xs uppercase tracking-[0.25em] mt-2" style={{ color: s.color }}>
                {t(s.k)}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOUR PROBLEMS WE SOLVE */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-20 lg:py-28">
        <div className="grid lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-4">
            <div className="text-xs uppercase tracking-[0.25em] text-[#E06D53] mb-3">Why we exist</div>
            <h2 className="font-serif text-4xl lg:text-5xl tracking-tight text-[#1C2220] leading-[1.05]">
              {t("why_title")}
            </h2>
            <p className="mt-5 text-[#4A5D54] leading-relaxed">
              We solve the four hardest problems in Indian organ donation: fairness, trust, speed, and access.
            </p>
          </div>
          <div className="lg:col-span-8 grid sm:grid-cols-2 gap-5">
            {[
              { icon: Shield, key: "problem1", num: "01" },
              { icon: Heart, key: "problem2", num: "02" },
              { icon: Activity, key: "problem3", num: "03" },
              { icon: IdCard, key: "problem4", num: "04" },
            ].map((p) => (
              <div
                key={p.key}
                className="group p-7 rounded-2xl bg-[#EDF0EB] border border-[#D3D9D5] hover:border-[#2A5A4A]/40 transition-colors"
                data-testid={`problem-card-${p.num}`}
              >
                <div className="flex items-start justify-between mb-5">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-[#D3D9D5]">
                    <p.icon className="w-4 h-4 text-[#2A5A4A]" />
                  </div>
                  <span className="font-serif text-2xl text-[#4A5D54]">{p.num}</span>
                </div>
                <div className="font-serif text-2xl text-[#1C2220] leading-tight">{t(`${p.key}_t`)}</div>
                <div className="mt-3 text-sm text-[#4A5D54] leading-relaxed">{t(`${p.key}_d`)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GREEN CORRIDOR */}
      <section className="bg-[#EDF0EB] border-y border-[#D3D9D5]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5">
            <div className="text-xs uppercase tracking-[0.25em] text-[#2A5A4A] mb-3">Live Network</div>
            <h2 className="font-serif text-4xl lg:text-5xl tracking-tight text-[#1C2220] leading-[1.05]">
              Green Corridors. <br />
              <span className="italic text-[#E06D53]">Minutes that save lives.</span>
            </h2>
            <p className="mt-5 text-[#4A5D54] leading-relaxed">
              When a viable organ is released, our system instantly identifies the most urgent
              matching patient nearby, alerts state police to clear traffic, and tracks the
              ambulance until handoff. Every minute matters — a heart has just 4 hours.
            </p>
            <ul className="mt-7 space-y-3 text-sm">
              {[
                "Instant matching by urgency, blood group & geo-distance",
                "Auto-alert to traffic police for corridor clearance",
                "Live route tracking visible to all stakeholders",
              ].map((line) => (
                <li key={line} className="flex items-start gap-3">
                  <ChevronRight className="w-4 h-4 text-[#2A5A4A] mt-0.5 shrink-0" />
                  <span className="text-[#1C2220]">{line}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-7">
            <div className="rounded-3xl bg-white border border-[#D3D9D5] p-6 lg:p-10">
              <GreenCorridor />
            </div>
          </div>
        </div>
      </section>

      {/* STORIES */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-24 relative grain">
        <div className="text-xs uppercase tracking-[0.25em] text-[#E06D53] mb-3">Stories</div>
        <h2 className="font-serif text-4xl lg:text-5xl tracking-tight text-[#1C2220] max-w-3xl">
          Behind every transplant is a family who said yes.
        </h2>
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          {[
            { quote: "I was waiting for a kidney for 3 years. The day I got the call, I cried for six hours straight.", who: "Asha, 34 · Recipient" },
            { quote: "My son was 19. We donated everything. Today, eight families call me on his birthday.", who: "Mr. Verma · Donor family" },
            { quote: "We saw the corridor on the news — 22 minutes from airport to OT. That heart was mine.", who: "Vikram, 51 · Recipient" },
          ].map((s, i) => (
            <div key={i} className="p-7 bg-white border border-[#D3D9D5] rounded-2xl" data-testid={`story-${i}`}>
              <Quote className="w-6 h-6 text-[#E06D53] mb-3" />
              <p className="font-serif text-xl leading-snug text-[#1C2220]">"{s.quote}"</p>
              <div className="mt-5 text-xs uppercase tracking-[0.2em] text-[#4A5D54]">{s.who}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-24">
        <div className="rounded-3xl bg-[#2A5A4A] text-white p-10 lg:p-16 grid lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8">
            <h3 className="font-serif text-4xl lg:text-5xl leading-tight">
              Take 2 minutes. <span className="italic text-[#E0C58A]">Save up to 8 lives.</span>
            </h3>
            <p className="mt-4 text-white/80 max-w-xl">
              Pledge with Aadhaar, get your digital Donor Card instantly, and tell your family
              the most important thing they may ever hear.
            </p>
          </div>
          <div className="lg:col-span-4 flex lg:justify-end">
            <Link to="/register">
              <Button data-testid="cta-pledge-bottom" className="bg-[#E06D53] hover:bg-[#C85A42] text-white rounded-full px-7 py-6 text-base">
                <Heart className="w-4 h-4 mr-2" fill="white" strokeWidth={0} />
                {t("cta_pledge")}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

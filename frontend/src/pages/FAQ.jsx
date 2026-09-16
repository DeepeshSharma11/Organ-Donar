import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const items = [
  {
    q: "Will doctors stop trying to save my life if they know I'm a donor?",
    a: "No. This is the single biggest myth. The treating team and the transplant team are completely separate — by law. Doctors are bound by oath to save your life first. Donation is only considered after brain death is independently certified.",
    tag: "Myth",
  },
  {
    q: "Does my religion allow organ donation?",
    a: "All major religions practised in India — Hinduism, Islam, Christianity, Sikhism, Jainism, Buddhism — explicitly support or permit organ donation as an act of charity and saving life (one of the highest virtues).",
    tag: "Faith",
  },
  {
    q: "Is there a black market? Can someone steal my organs?",
    a: "Under the Transplantation of Human Organs Act (1994, amended 2011), organ trade is criminal and carries up to 10 years' imprisonment. Every transplant is monitored by NOTTO/SOTTO. A digital, public queue like OrganBridge makes secret reordering impossible.",
    tag: "Law",
  },
  {
    q: "What is the age limit?",
    a: "There is no upper age limit. The medical condition of the organ matters, not age. People in their 80s have successfully donated.",
    tag: "Eligibility",
  },
  {
    q: "Will my family be charged for the donation?",
    a: "No. The donor's family pays nothing. All costs related to organ retrieval are borne by the recipient or the system.",
    tag: "Cost",
  },
  {
    q: "Does donation disfigure the body?",
    a: "No. Organs are retrieved with the same care as any surgery. The body is returned to the family for last rites with full dignity.",
    tag: "Myth",
  },
  {
    q: "Can my family override my pledge?",
    a: "Legally and practically, in India, the family's consent is required at the time of death. That is why the most important step after pledging is telling your family. A digital donor card with QR makes that conversation easier.",
    tag: "Consent",
  },
  {
    q: "How does Aadhaar verification work here?",
    a: "We use Aadhaar only to verify your identity and link the pledge to a unique citizen. Your full Aadhaar number is never displayed — only the last 4 digits appear on your donor card.",
    tag: "Privacy",
  },
];

export default function FAQ() {
  return (
    <div className="max-w-5xl mx-auto px-6 lg:px-10 py-16 lg:py-24">
      <div className="text-xs uppercase tracking-[0.25em] text-[#E06D53] mb-3">FAQ · Myth Buster</div>
      <h1 className="font-serif text-5xl lg:text-6xl tracking-tighter leading-[0.95] text-[#1C2220]">
        Honest answers to <span className="italic">hard questions.</span>
      </h1>
      <p className="mt-6 text-lg text-[#4A5D54] max-w-2xl">
        We hear the same fears every day. Here's what is actually true — backed by law, medicine, and faith.
      </p>

      <Accordion type="single" collapsible className="mt-12 space-y-3" data-testid="faq-accordion">
        {items.map((it, i) => (
          <AccordionItem
            key={i}
            value={`item-${i}`}
            className="bg-white border border-[#D3D9D5] rounded-2xl px-6"
            data-testid={`faq-item-${i}`}
          >
            <AccordionTrigger className="hover:no-underline py-5">
              <div className="flex items-start gap-4 text-left">
                <span className="text-[10px] uppercase tracking-[0.2em] px-2 py-1 rounded-full bg-[#EDF0EB] text-[#2A5A4A] mt-1 shrink-0">
                  {it.tag}
                </span>
                <span className="font-serif text-xl text-[#1C2220]">{it.q}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-[#4A5D54] leading-relaxed pb-5 pl-[88px]">
              {it.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

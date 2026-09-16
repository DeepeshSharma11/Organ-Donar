import { useEffect, useState } from "react";
import { Activity, ShieldCheck } from "lucide-react";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/api";

const urgencyColor = (u) => {
  if (u >= 5) return "bg-[#E06D53] text-white";
  if (u >= 4) return "bg-[#D4A017] text-white";
  if (u >= 3) return "bg-[#2A5A4A] text-white";
  return "bg-[#EDF0EB] text-[#1C2220]";
};

export default function Waitlist() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/waitlist/public").then((r) => setItems(r.data)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 lg:py-24">
      <div className="grid lg:grid-cols-12 gap-10 items-end mb-10">
        <div className="lg:col-span-8">
          <div className="text-xs uppercase tracking-[0.25em] text-[#E06D53] mb-3">Public Waitlist</div>
          <h1 className="font-serif text-5xl tracking-tighter text-[#1C2220]">
            One queue. One country. No exceptions.
          </h1>
          <p className="text-[#4A5D54] mt-5 max-w-2xl">
            This is the anonymized national waiting list. Names are masked — but order, urgency,
            and geography are public, so no hospital, no influence, and no amount of money can
            rearrange it.
          </p>
        </div>
        <div className="lg:col-span-4 p-6 rounded-2xl bg-[#2A5A4A] text-white">
          <ShieldCheck className="w-5 h-5" />
          <div className="font-serif text-2xl mt-2">100% transparent</div>
          <div className="text-sm opacity-80 mt-1">Every entry · every reshuffle · is timestamped & immutable.</div>
        </div>
      </div>

      <div className="bg-white border border-[#D3D9D5] rounded-2xl overflow-hidden" data-testid="waitlist-table-wrap">
        {loading ? (
          <div className="p-10 text-center text-[#4A5D54]">Loading…</div>
        ) : items.length === 0 ? (
          <div className="p-10 text-center text-[#4A5D54]">No patients currently on the waitlist.</div>
        ) : (
          <Table data-testid="waitlist-table">
            <TableHeader>
              <TableRow className="bg-[#EDF0EB]">
                <TableHead>Queue ID</TableHead>
                <TableHead>Organ</TableHead>
                <TableHead>Blood</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>State</TableHead>
                <TableHead className="text-right">Urgency</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((p) => (
                <TableRow key={p.queue_id} data-testid={`waitlist-row-${p.queue_id}`}>
                  <TableCell className="font-mono text-xs">{p.queue_id}</TableCell>
                  <TableCell className="font-medium">
                    <Activity className="w-3.5 h-3.5 inline mr-1.5 text-[#2A5A4A]" />
                    {p.organ_needed}
                  </TableCell>
                  <TableCell>{p.blood_group}</TableCell>
                  <TableCell>{p.age_band}</TableCell>
                  <TableCell>{p.state}</TableCell>
                  <TableCell className="text-right">
                    <Badge className={`${urgencyColor(p.urgency)} rounded-full px-2.5`}>
                      {p.urgency}/5
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}

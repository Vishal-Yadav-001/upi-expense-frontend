import { BillsContainer } from "@/components/bills/BillsContainer";
import { CreditCard } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Subscriptions & Bills",
  description: "Manage and monitor your periodic statements, detected commitments, AI analyzed transaction mandates, and upcoming bills in one central panel.",
};

export default function BillsPage() {
  return (
    <div className="h-full overflow-y-auto p-6 space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-accent/10 text-accent rounded-xl border border-accent/20">
          <CreditCard size={22} />
        </div>
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground font-heading">Subscriptions & Bills</h2>
          <p className="text-[10px] text-foreground/40 font-bold uppercase tracking-[0.2em]">Manage your recurring commitments</p>
        </div>
      </div>

      <BillsContainer />
    </div>
  );
}

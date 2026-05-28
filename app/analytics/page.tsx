import { AnalyticsContainer } from "@/components/analytics/AnalyticsContainer";
import { TrendingUp } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analytics Engine",
  description: "Deep financial analytics, monthly aggregates, weekly transaction counts, and category spending distributions.",
};

export default function AnalyticsPage() {
  return (
    <div className="h-full overflow-y-auto p-6 space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-accent/10 text-accent rounded-xl border border-accent/20">
          <TrendingUp size={22} />
        </div>
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground font-heading">Analytics Engine</h2>
          <p className="text-[10px] text-foreground/40 font-bold uppercase tracking-[0.2em]">Deep Insights & Summaries</p>
        </div>
      </div>

      <AnalyticsContainer />
    </div>
  );
}

import { AnalyticsContainer } from "@/components/analytics/AnalyticsContainer";
import { TrendingUp } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analytics Engine",
  description: "Deep financial analytics, monthly aggregates, weekly transaction counts, and category spending distributions.",
};

export default function AnalyticsPage() {
  return (
    <div className="h-full overflow-y-auto p-6 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <AnalyticsContainer />
    </div>
  );
}

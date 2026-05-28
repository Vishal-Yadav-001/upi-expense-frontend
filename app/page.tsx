import { DashboardContainer } from "@/components/dashboard/DashboardContainer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Command Center | UPI Sense",
  description: "Real-time financial bento dashboard tracking budgets, subscriptions, and statement audit ledgers.",
};

export default function DashboardPage() {
  return (
    <div className="h-full overflow-y-auto p-6 space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <DashboardContainer />
    </div>
  );
}

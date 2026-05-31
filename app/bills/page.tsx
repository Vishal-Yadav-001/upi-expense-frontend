import { BillsContainer } from "@/components/bills/BillsContainer";
import { CreditCard } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Subscriptions & Bills",
  description: "Manage and monitor your periodic statements, detected commitments, AI analyzed transaction mandates, and upcoming bills in one central panel.",
};

export default function BillsPage() {
  return (
    <div className="h-full overflow-y-auto p-6 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <BillsContainer />
    </div>
  );
}

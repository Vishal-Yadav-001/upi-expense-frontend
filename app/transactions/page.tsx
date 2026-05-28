import { TransactionsContainer } from "@/components/transactions/TransactionsContainer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Transaction Ledger | UPI Sense",
  description: "Detailed financial ledger audit trail tracking periodic UPI debit transfers, credit deposits, and AI-assisted categorization.",
};

export default function TransactionsPage() {
  return (
    <div className="h-full overflow-y-auto p-6 space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <TransactionsContainer />
    </div>
  );
}

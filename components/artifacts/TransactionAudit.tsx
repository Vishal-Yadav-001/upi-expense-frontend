"use client";

import { usePrivacy } from "@/context/PrivacyContext";
import { maskName } from "@/lib/privacy";

interface Transaction {
  id: string;
  amount: number;
  direction: string;
  date: string;
  payee?: {
    displayName: string;
    category: string;
    normalizedName?: string;
  };
}

interface TransactionAuditProps {
  transactions: Transaction[];
  loading?: boolean;
  isRecentExpenses?: boolean;
}

export const TransactionAudit = ({ transactions, loading, isRecentExpenses }: TransactionAuditProps) => {
  const { isPrivacyEnabled } = usePrivacy();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  if (loading) {
    return (
      <div className="bg-card border border-border p-6 rounded-2xl animate-pulse">
        <div className="h-6 w-48 bg-background rounded mb-6" />
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 bg-background rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      <div className="p-6 border-b border-border/50 flex items-center justify-between">
        <h3 className="font-bold text-lg">
          {isRecentExpenses ? "Recent Expenses" : "Transaction Audit"}
        </h3>
        <span className="text-xs font-medium text-foreground/30 uppercase tracking-widest">
          {isRecentExpenses ? "Last 5 Debits" : "Live Ledger"}
        </span>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border/30 text-[10px] uppercase tracking-widest text-foreground/40 font-bold">
              <th className="px-6 py-4">Entity</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/20">
            {transactions.map((tx) => {
              const payeeName = tx.payee?.displayName || "Unknown Payee";
              const initials = getInitials(payeeName);
              const isDebit = tx.direction === "DEBIT";

              return (
                <tr key={tx.id} className="group hover:bg-primary/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        isDebit ? "bg-secondary/20 text-secondary" : "bg-primary/20 text-primary"
                      }`}>
                        {initials}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-foreground/90">
                          {isPrivacyEnabled ? maskName(payeeName) : payeeName}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-muted rounded-full text-foreground/60">
                      {tx.payee?.category || "Uncategorized"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-mono text-foreground/50">
                      {new Date(parseInt(tx.date) || tx.date).toLocaleDateString(undefined, { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-right font-mono font-bold text-sm ${
                    isDebit ? "text-destructive" : "text-emerald-400"
                  }`}>
                    {`₹${tx.amount.toLocaleString()}`}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

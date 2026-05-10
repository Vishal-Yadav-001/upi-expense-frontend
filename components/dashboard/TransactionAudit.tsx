"use client";

import React from "react";
import { Shield, FolderOpen, ArrowUpRight, ArrowDownLeft, RefreshCw, Loader2 } from "lucide-react";
import { usePrivacy } from "@/context/PrivacyContext";
import { maskName } from "@/lib/privacy";
import { cn } from "@/lib/utils";
import { CategoryDropdown } from "../transactions/CategoryDropdown";
import { useSync } from "@/hooks/useSync";

export interface Transaction {
  id: string;
  payeeId?: string;
  entity: string;
  category: string;
  date: string;
  amount: number;
  direction: "IN" | "OUT";
}

interface TransactionAuditProps {
  transactions?: Transaction[];
  className?: string;
}

export const TransactionAudit = ({ transactions = [], className }: TransactionAuditProps) => {
  const { isPrivacyEnabled, hasHydrated } = usePrivacy();
  const { sync, isSyncing } = useSync();

  const formatAmount = (amount: number, direction: "IN" | "OUT") => {
    const isMasked = isPrivacyEnabled && hasHydrated;
    const absAmount = Math.abs(amount).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    
    if (isMasked) {
      return (
        <span className="font-mono">
          {direction === "IN" ? "+" : "-"} ₹{absAmount.replace(/\d/g, "*")}
        </span>
      );
    }

    return (
      <span className={cn(
        "font-mono font-bold",
        direction === "IN" ? "text-teal" : "text-foreground"
      )}>
        {direction === "IN" ? "+" : "-"} ₹{absAmount}
      </span>
    );
  };

  const getMaskedEntity = (name: string) => {
    if (isPrivacyEnabled && hasHydrated) {
      return maskName(name);
    }
    return name;
  };

  return (
    <div className={cn(
      "bg-card border border-border rounded-2xl flex flex-col overflow-hidden",
      className
    )}>
      {/* Header */}
      <div className="p-5 flex items-center justify-between border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-accent/10 text-accent rounded-lg border border-accent/20">
            <Shield size={18} />
          </div>
          <div>
            <h3 className="font-heading font-bold text-foreground">Transaction Audit</h3>
            <p className="text-[10px] font-heading font-bold text-foreground/30 uppercase tracking-[0.2em] mt-0.5">Live Ledger</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={sync}
            disabled={isSyncing}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all text-[10px] font-bold uppercase tracking-wider h-fit",
              isSyncing 
                ? "bg-teal/20 border-teal/50 text-teal animate-pulse" 
                : "bg-teal/5 border-teal/10 text-teal hover:bg-teal/10 hover:border-teal/20"
            )}
            title="Sync AI & Analytics"
          >
            {isSyncing ? (
              <>
                <Loader2 size={12} className="animate-spin" />
                <span>Syncing...</span>
              </>
            ) : (
              <>
                <RefreshCw size={12} />
                <span>Sync AI</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-2 px-2.5 py-1 bg-teal/5 border border-teal/10 rounded-full h-fit">
            <div className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse" />
            <span className="text-[10px] font-bold text-teal uppercase tracking-wider">Live</span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        {transactions.length > 0 ? (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-panel/50">
                <th className="text-left px-5 py-3 text-[10px] font-heading font-bold text-foreground/50 uppercase tracking-widest border-b border-border/30">Entity</th>
                <th className="text-left px-5 py-3 text-[10px] font-heading font-bold text-foreground/50 uppercase tracking-widest border-b border-border/30">Category</th>
                <th className="text-left px-5 py-3 text-[10px] font-heading font-bold text-foreground/50 uppercase tracking-widest border-b border-border/30">Date</th>
                <th className="text-right px-5 py-3 text-[10px] font-heading font-bold text-foreground/50 uppercase tracking-widest border-b border-border/30">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {transactions.map((tx) => (
                <tr 
                  key={tx.id} 
                  className="group hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "p-1.5 rounded-md border",
                        tx.direction === "IN" 
                          ? "bg-teal/5 border-teal/10 text-teal" 
                          : "bg-white/5 border-white/5 text-foreground/40"
                      )}>
                        {tx.direction === "IN" ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}
                      </div>
                      <span className="text-sm font-medium text-foreground group-hover:text-white transition-colors">
                        {getMaskedEntity(tx.entity)}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    {tx.payeeId ? (
                      <CategoryDropdown 
                        payeeId={tx.payeeId} 
                        currentCategory={tx.category} 
                      />
                    ) : (
                      <span className="text-xs px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-foreground/60">
                        {tx.category}
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs text-foreground/40 font-mono">
                      {tx.date}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    {formatAmount(tx.amount, tx.direction)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="h-full flex flex-col items-center justify-center py-20 text-foreground/20">
            <FolderOpen size={48} strokeWidth={1} className="mb-4" />
            <p className="text-sm font-medium">No transactions yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

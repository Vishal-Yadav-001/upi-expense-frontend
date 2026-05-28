"use client";

import React, { useState } from "react";
import { ListFilter, Search, RefreshCw, Loader2, ArrowUpRight, ArrowDownLeft, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@apollo/client/react";
import { GET_TRANSACTIONS_LEDGER, TransactionsLedgerData } from "@/lib/queries";
import { CategoryDropdown } from "@/components/transactions/CategoryDropdown";
import { usePrivacy } from "@/context/PrivacyContext";
import { maskName } from "@/lib/privacy";
import { useSync } from "@/hooks/useSync";
import { cn } from "@/lib/utils";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 }
};

export default function TransactionsPage() {
  const [direction, setDirection] = useState<"ALL" | "DEBIT" | "CREDIT">("ALL");
  const [limit, setLimit] = useState<number>(50);
  const [searchTerm, setSearchTerm] = useState("");

  const { isPrivacyEnabled, hasHydrated } = usePrivacy();
  const { sync, isSyncing } = useSync();

  const queryVariables = {
    limit,
    direction: direction === "ALL" ? undefined : direction,
  };

  const { data, loading, error, refetch } = useQuery<TransactionsLedgerData>(
    GET_TRANSACTIONS_LEDGER,
    {
      variables: queryVariables,
      notifyOnNetworkStatusChange: true,
    }
  );

  const rawTransactions = data?.transactions || [];

  // Client-side search matching entity display name and category
  const filteredTransactions = rawTransactions.filter((tx) => {
    const term = searchTerm.toLowerCase();
    const entityMatch = tx.payee?.displayName.toLowerCase().includes(term) || false;
    const categoryMatch = tx.payee?.category.toLowerCase().includes(term) || false;
    return entityMatch || categoryMatch;
  });

  const getMaskedEntity = (name: string) => {
    if (isPrivacyEnabled && hasHydrated) {
      return maskName(name);
    }
    return name;
  };

  const formatAmount = (amount: number, txDirection: string) => {
    const isMasked = isPrivacyEnabled && hasHydrated;
    const absAmount = Math.abs(amount).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    if (isMasked) {
      return (
        <span className="font-mono text-foreground/70">
          {txDirection === "CREDIT" ? "+" : "-"} ₹{absAmount.replace(/\d/g, "*")}
        </span>
      );
    }

    return (
      <span className={cn(
        "font-mono font-bold",
        txDirection === "CREDIT" ? "text-teal" : "text-foreground"
      )}>
        {txDirection === "CREDIT" ? "+" : "-"} ₹{absAmount}
      </span>
    );
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="h-full overflow-y-auto p-6 space-y-8 pb-20"
      style={{ scrollbarGutter: "stable" }}
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-teal/10 text-teal rounded-xl border border-teal/20">
            <ListFilter size={22} />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-foreground">Transaction Ledger</h2>
            <p className="text-[10px] text-foreground/40 font-bold uppercase tracking-[0.2em]">Detailed Audit Trail</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => refetch()}
            disabled={loading}
            className="p-2 bg-white/5 border border-white/5 hover:bg-white/10 text-foreground/60 hover:text-white rounded-xl transition-all"
            title="Reload Transactions"
          >
            <RefreshCw size={16} className={cn(loading && "animate-spin")} />
          </button>

          <button
            onClick={sync}
            disabled={isSyncing}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl border transition-all text-xs font-bold uppercase tracking-wider",
              isSyncing
                ? "bg-teal/20 border-teal/50 text-teal animate-pulse"
                : "bg-teal/10 border-teal/20 text-teal hover:bg-teal/20"
            )}
          >
            {isSyncing ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>Syncing AI...</span>
              </>
            ) : (
              <>
                <RefreshCw size={14} />
                <span>Sync AI</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Control Bar (Filters, Search, Limit) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-center bg-card border border-border p-4 rounded-2xl">
        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/30" />
          <input
            type="text"
            placeholder="Search merchants or categories..."
            className="w-full bg-white/5 border border-border/80 focus:border-accent/40 rounded-xl pl-10 pr-4 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-foreground/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Direction Filters */}
        <div className="flex items-center bg-panel/30 border border-border/50 p-1 rounded-xl justify-self-stretch lg:justify-self-center">
          {(["ALL", "DEBIT", "CREDIT"] as const).map((dir) => (
            <button
              key={dir}
              onClick={() => setDirection(dir)}
              className={cn(
                "flex-1 px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all",
                direction === dir
                  ? "bg-accent text-background shadow-lg shadow-accent/20"
                  : "text-foreground/40 hover:text-foreground/75"
              )}
            >
              {dir === "DEBIT" ? "Spent" : dir === "CREDIT" ? "Received" : "All"}
            </button>
          ))}
        </div>

        {/* Limit Selector */}
        <div className="flex items-center gap-3 justify-end justify-self-stretch lg:justify-self-end">
          <span className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest">Rows:</span>
          <select
            className="bg-white/5 border border-border/80 focus:border-accent/40 rounded-xl px-3 py-1.5 text-xs text-foreground font-bold outline-none cursor-pointer"
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
          >
            {[20, 50, 100, 200].map((size) => (
              <option key={size} value={size} className="bg-card text-foreground">
                {size}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Ledger Container */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden flex flex-col min-h-[400px]">
        {loading && !data ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 text-foreground/40">
            <Loader2 size={36} className="animate-spin text-accent mb-4" />
            <p className="text-sm font-medium">Fetching secure transaction data...</p>
          </div>
        ) : error ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-destructive/80 text-center space-y-3">
            <ShieldAlert size={48} strokeWidth={1.5} />
            <h3 className="font-heading font-bold text-lg">Failed to retrieve records</h3>
            <p className="text-sm max-w-md">{error.message}</p>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-destructive/10 hover:bg-destructive/20 border border-destructive/20 rounded-xl text-xs font-bold uppercase transition-all"
            >
              Try Again
            </button>
          </div>
        ) : filteredTransactions.length > 0 ? (
          <table className="w-full border-collapse table-fixed">
              <thead>
                <tr className="bg-panel/50 border-b border-border/30">
                  <th className="text-left px-6 py-4 text-[10px] font-heading font-bold text-foreground/40 uppercase tracking-widest w-[35%]">Entity</th>
                  <th className="text-left px-6 py-4 text-[10px] font-heading font-bold text-foreground/40 uppercase tracking-widest w-[20%]">Category</th>
                  <th className="text-left px-6 py-4 text-[10px] font-heading font-bold text-foreground/40 uppercase tracking-widest w-[15%]">Date</th>
                  <th className="text-left px-6 py-4 text-[10px] font-heading font-bold text-foreground/40 uppercase tracking-widest w-[15%]">Status</th>
                  <th className="text-right px-6 py-4 text-[10px] font-heading font-bold text-foreground/40 uppercase tracking-widest w-[15%]">Amount</th>
                </tr>
              </thead>
              <motion.tbody
                key={`${direction}-${searchTerm}`}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="divide-y divide-border/20"
              >
                {filteredTransactions.map((tx) => (
                  <tr
                    key={tx.id}
                    className="group hover:bg-white/[0.01] transition-colors"
                  >
                    {/* Entity */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "p-2 rounded-lg border",
                          tx.direction === "CREDIT"
                            ? "bg-teal/5 border-teal/10 text-teal"
                            : "bg-white/5 border-white/5 text-foreground/40"
                        )}>
                          {tx.direction === "CREDIT" ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}
                        </div>
                        <div>
                          <span className="text-sm font-medium text-foreground group-hover:text-white transition-colors">
                            {tx.payee ? getMaskedEntity(tx.payee.displayName) : "Unknown Payee"}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-6 py-4">
                      {tx.payee?.id ? (
                        <CategoryDropdown
                          payeeId={tx.payee.id}
                          currentCategory={tx.payee.category}
                        />
                      ) : (
                        <span className="text-xs px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-foreground/50">
                          Uncategorized
                        </span>
                      )}
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4">
                      <span className="text-xs text-foreground/50 font-mono">
                        {new Date(isNaN(Number(tx.date)) ? tx.date : Number(tx.date)).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric"
                        })}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span className={cn(
                        "text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border",
                        tx.status === "SUCCESS"
                          ? "bg-teal/5 border-teal/10 text-teal"
                          : "bg-destructive/10 border-destructive/20 text-destructive"
                      )}>
                        {tx.status || "SUCCESS"}
                      </span>
                    </td>

                    {/* Amount */}
                    <td className="px-6 py-4 text-right">
                      {formatAmount(tx.amount, tx.direction)}
                    </td>
                  </tr>
                ))}
              </motion.tbody>
            </table>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center py-20 text-foreground/20 text-center">
            <Search size={48} strokeWidth={1} className="mb-4 text-foreground/10" />
            <p className="text-sm font-medium">No matching transactions found.</p>
            <p className="text-[10px] uppercase tracking-widest mt-1 text-foreground/40">Try adjusting your filters or search term</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

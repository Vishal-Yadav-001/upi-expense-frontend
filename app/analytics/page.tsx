"use client";

import React, { useState } from "react";
import { TrendingUp, BarChart3, Receipt, IndianRupee, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@apollo/client/react";
import { GET_SUMMARIES } from "@/lib/queries";
import { clsx } from "clsx";

export default function AnalyticsPage() {
  const [periodType, setPeriodType] = useState<"MONTHLY" | "WEEKLY">("MONTHLY");
  
  const { data, loading, error } = useQuery(GET_SUMMARIES, {
    variables: { type: periodType, limit: periodType === "MONTHLY" ? 6 : 12 },
    notifyOnNetworkStatusChange: true,
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full overflow-y-auto p-6 space-y-8 pb-20"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-accent/10 text-accent rounded-xl border border-accent/20">
            <TrendingUp size={22} />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-foreground">Analytics Engine</h2>
            <p className="text-[10px] text-foreground/40 font-bold uppercase tracking-[0.2em]">Deep Insights & Summaries</p>
          </div>
        </div>

        {/* Period Toggle */}
        <div className="flex items-center bg-card border border-border p-1 rounded-xl shrink-0">
          <button
            onClick={() => setPeriodType("MONTHLY")}
            className={clsx(
              "px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2",
              periodType === "MONTHLY" ? "bg-accent text-background shadow-lg shadow-accent/20" : "text-foreground/40 hover:text-foreground/70"
            )}
          >
            <Calendar size={14} />
            MONTHLY
          </button>
          <button
            onClick={() => setPeriodType("WEEKLY")}
            className={clsx(
              "px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2",
              periodType === "WEEKLY" ? "bg-accent text-background shadow-lg shadow-accent/20" : "text-foreground/40 hover:text-foreground/70"
            )}
          >
            <BarChart3 size={14} />
            WEEKLY
          </button>
        </div>
      </div>

      {loading && !data ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
        </div>
      ) : error ? (
        <div className="p-4 bg-destructive/10 text-destructive rounded-xl border border-destructive/20 text-sm">
          Failed to load analytics data: {error.message}
        </div>
      ) : data?.financialSummaries?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-card border border-border rounded-2xl text-foreground/20">
          <BarChart3 size={48} strokeWidth={1} className="mb-4" />
          <p className="text-sm font-medium">No {periodType.toLowerCase()} summary data available.</p>
          <p className="text-[10px] uppercase tracking-widest mt-2">Upload a statement to generate insights</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {data?.financialSummaries.map((summary: {
              id: string;
              type: string;
              period: string;
              totalDebit: number;
              totalCredit: number;
              transactionCount: number;
              topCategories: { category: string; amount: number }[];
              lastUpdated: string;
            }) => (
              <motion.div 
                key={summary.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-card border border-border rounded-2xl p-6 space-y-4 hover:border-accent/40 transition-colors flex flex-col"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold">{summary.period}</h3>
                    {summary.type === "WEEKLY" && (
                      <p className="text-[9px] text-foreground/30 font-bold uppercase tracking-tighter">Week Starting</p>
                    )}
                  </div>
                  <span className="text-[10px] bg-accent/10 text-accent px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                    {summary.type}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-foreground/[0.02] rounded-xl border border-border/50">
                    <p className="text-[9px] text-foreground/40 font-bold uppercase mb-1">Total Spent</p>
                    <p className="text-lg font-bold text-foreground flex items-center gap-1">
                      <IndianRupee size={14} className="text-accent" />
                      {summary.totalDebit.toLocaleString("en-IN")}
                    </p>
                  </div>
                  <div className="p-3 bg-foreground/[0.02] rounded-xl border border-border/50">
                    <p className="text-[9px] text-foreground/40 font-bold uppercase mb-1">Received</p>
                    <p className="text-lg font-bold text-foreground flex items-center gap-1">
                      <IndianRupee size={14} className="text-emerald-500" />
                      {summary.totalCredit.toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-2 text-[10px] text-foreground/40 font-bold uppercase tracking-wider">
                    <BarChart3 size={12} />
                    Top Categories
                  </div>
                  <div className="space-y-2">
                    {summary.topCategories.length > 0 ? (
                      summary.topCategories.map((cat, i) => (
                        <div key={i} className="flex items-center justify-between text-xs">
                          <span className="text-foreground/70 truncate mr-2">{cat.category}</span>
                          <span className="font-medium shrink-0">₹{cat.amount.toLocaleString("en-IN")}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-[10px] text-foreground/30 italic">No category data</p>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-border/50 flex items-center justify-between text-[9px] text-foreground/30 font-medium">
                  <div className="flex items-center gap-1">
                    <Receipt size={10} />
                    {summary.transactionCount} transactions
                  </div>
                  <span>Updated {new Date(summary.lastUpdated).toLocaleDateString()}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}

"use client";

import React from "react";
import { TrendingUp, BarChart3, Receipt, IndianRupee } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "@apollo/client";
import { GET_SUMMARIES } from "@/lib/queries";

export default function AnalyticsPage() {
  const { data, loading, error } = useQuery(GET_SUMMARIES, {
    variables: { type: "MONTHLY", limit: 6 }
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full overflow-y-auto p-6 space-y-8 pb-20"
    >
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-accent/10 text-accent rounded-xl border border-accent/20">
          <TrendingUp size={22} />
        </div>
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">Analytics Engine</h2>
          <p className="text-[10px] text-foreground/40 font-bold uppercase tracking-[0.2em]">Deep Insights & Summaries</p>
        </div>
      </div>

      {loading ? (
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
          <p className="text-sm font-medium">No summary data available. Upload a statement to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data?.financialSummaries.map((summary: {
            id: string;
            period: string;
            totalDebit: number;
            totalCredit: number;
            transactionCount: number;
            topCategories: { category: string; amount: number }[];
            lastUpdated: string;
          }) => (
            <div key={summary.id} className="bg-card border border-border rounded-2xl p-6 space-y-4 hover:border-accent/40 transition-colors">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">{summary.period}</h3>
                <span className="text-[10px] bg-accent/10 text-accent px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  Monthly Summary
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-foreground/[0.02] rounded-xl border border-border/50">
                  <p className="text-[9px] text-foreground/40 font-bold uppercase mb-1">Total Spent</p>
                  <p className="text-xl font-bold text-foreground flex items-center gap-1">
                    <IndianRupee size={16} className="text-accent" />
                    {summary.totalDebit.toLocaleString("en-IN")}
                  </p>
                </div>
                <div className="p-3 bg-foreground/[0.02] rounded-xl border border-border/50">
                  <p className="text-[9px] text-foreground/40 font-bold uppercase mb-1">Received</p>
                  <p className="text-xl font-bold text-foreground flex items-center gap-1">
                    <IndianRupee size={16} className="text-success" />
                    {summary.totalCredit.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-[10px] text-foreground/40 font-bold uppercase tracking-wider">
                  <BarChart3 size={12} />
                  Top Categories
                </div>
                <div className="space-y-2">
                  {summary.topCategories.map((cat, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span className="text-foreground/70">{cat.category}</span>
                      <span className="font-medium">Rs {cat.amount.toLocaleString("en-IN")}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-border/50 flex items-center justify-between text-[10px] text-foreground/30">
                <div className="flex items-center gap-1">
                  <Receipt size={10} />
                  {summary.transactionCount} transactions
                </div>
                <span>Last updated: {new Date(summary.lastUpdated).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

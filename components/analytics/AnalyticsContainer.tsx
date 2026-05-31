"use client";

import React, { useState } from "react";
import { 
  TrendingUp, 
  BarChart3, 
  Receipt, 
  IndianRupee, 
  Calendar,
  ShieldAlert,
  Loader2,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@apollo/client/react";
import { GET_SUMMARIES } from "@/lib/queries";
import { cn } from "@/lib/utils";
import Link from "next/link";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const item = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0 }
};

export function AnalyticsContainer() {
  const [periodType, setPeriodType] = useState<"MONTHLY" | "WEEKLY">("MONTHLY");
  
  const { data, loading, error, refetch } = useQuery<any>(GET_SUMMARIES, {
    variables: { type: periodType, limit: periodType === "MONTHLY" ? 6 : 12 },
    notifyOnNetworkStatusChange: true,
  });

  const summaries = data?.financialSummaries || [];

  if (loading && !data) {
    return (
      <div className="flex justify-center py-24 flex-col items-center gap-4">
        <Loader2 size={36} className="animate-spin text-accent" />
        <p className="text-xs text-foreground/40 font-medium tracking-wide">Calculating database financial aggregations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-10 bg-card/30 border border-border/50 rounded-2xl text-destructive/80 text-center space-y-4 max-w-lg mx-auto animate-in fade-in">
        <ShieldAlert size={44} strokeWidth={1.5} className="text-destructive animate-pulse" />
        <h3 className="font-heading font-bold text-base text-white">Analytics Engine Halted</h3>
        <p className="text-xs text-foreground/60 leading-relaxed font-sans max-w-sm">{error.message}</p>
        <button
          onClick={() => refetch()}
          className="px-5 py-2.5 bg-destructive text-white hover:bg-red-700 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-destructive/15"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (summaries.length === 0) {
    return (
      <div className="p-12 border border-border/50 border-dashed rounded-3xl bg-card/25 text-foreground/20 text-center flex flex-col items-center justify-center min-h-[320px] relative overflow-hidden">
        <div className="absolute inset-0 bg-radial-gradient from-accent/5 via-transparent to-transparent opacity-30 blur-2xl pointer-events-none" />
        
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="mb-4 text-accent/30 w-14 h-14 rounded-full bg-accent/5 border border-accent/15 flex items-center justify-center shadow-lg shadow-accent/5"
        >
          <BarChart3 size={24} />
        </motion.div>
        
        <p className="text-sm font-bold text-foreground">No {periodType.toLowerCase()} summary data available.</p>
        <p className="text-[10px] uppercase tracking-widest mt-1.5 text-foreground/30 max-w-xs font-medium font-sans leading-relaxed">
          Upload bank or wallet statements to generate deep financial analytics insights
        </p>
        
        <div className="mt-6">
          <Link
            href="/imports"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-accent hover:bg-accent/90 text-background rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all shadow-lg shadow-accent/15 hover:shadow-accent/25 hover:-translate-y-0.5 cursor-pointer"
          >
            <span>Analyze Statements</span>
            <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Dynamic Header Period Controls */}
      <div className="flex flex-wrap items-center justify-end gap-3 mt-0 sm:-mt-16 lg:-mt-20 relative z-20 mb-4 sm:mb-0">
        <div className="flex items-center bg-panel border border-border/60 p-1 rounded-xl shrink-0">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setPeriodType("MONTHLY")}
            className={cn(
              "px-4 py-1.5 rounded-lg text-[10px] font-extrabold transition-all flex items-center gap-1.5 uppercase cursor-pointer outline-none",
              periodType === "MONTHLY" 
                ? "bg-accent text-background shadow-lg shadow-accent/10" 
                : "text-foreground/40 hover:text-foreground/70"
            )}
          >
            <Calendar size={12} />
            MONTHLY
          </motion.button>
          
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setPeriodType("WEEKLY")}
            className={cn(
              "px-4 py-1.5 rounded-lg text-[10px] font-extrabold transition-all flex items-center gap-1.5 uppercase cursor-pointer outline-none",
              periodType === "WEEKLY" 
                ? "bg-accent text-background shadow-lg shadow-accent/10" 
                : "text-foreground/40 hover:text-foreground/70"
            )}
          >
            <BarChart3 size={12} />
            WEEKLY
          </motion.button>
        </div>
      </div>

      {/* Analytics Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {summaries.map((summary: {
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
              variants={item}
              whileHover={{ y: -3, borderColor: "rgba(108, 127, 255, 0.3)" }}
              className="bg-card/40 border border-border/50 backdrop-blur-md rounded-2xl p-6 space-y-4 hover:shadow-xl hover:shadow-accent/[0.01] transition-all flex flex-col justify-between"
            >
              {/* Card Title */}
              <div className="flex items-center justify-between pb-1 border-b border-border/20">
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">{summary.period}</h3>
                  {summary.type === "WEEKLY" && (
                    <p className="text-[8px] text-foreground/30 font-bold uppercase tracking-widest font-sans mt-0.5">Week Starting</p>
                  )}
                </div>
                <span className="text-[9px] bg-accent/10 border border-accent/20 text-accent px-2 py-0.5 rounded-full font-bold uppercase tracking-wider font-sans">
                  {summary.type}
                </span>
              </div>

              {/* debit/credit summary cells */}
              <div className="grid grid-cols-2 gap-3.5">
                <div className="p-3 bg-white/5 rounded-xl border border-border/40">
                  <p className="text-[8px] text-foreground/40 font-bold uppercase tracking-wider font-sans mb-1.5">Total Spent</p>
                  <p className="text-sm font-extrabold text-white flex items-center gap-0.5 font-mono">
                    <IndianRupee size={11} className="text-accent shrink-0" />
                    {summary.totalDebit.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </p>
                </div>
                
                <div className="p-3 bg-white/5 rounded-xl border border-border/40">
                  <p className="text-[8px] text-foreground/40 font-bold uppercase tracking-wider font-sans mb-1.5">Received</p>
                  <p className="text-sm font-extrabold text-teal flex items-center gap-0.5 font-mono">
                    <IndianRupee size={11} className="text-teal shrink-0" />
                    {summary.totalCredit.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>

              {/* Relative progress category spending loader */}
              <div className="space-y-3.5 flex-1 pt-1.5">
                <div className="flex items-center gap-1.5 text-[9px] text-foreground/40 font-bold uppercase tracking-wider font-sans">
                  <BarChart3 size={11} />
                  Top Category Distribution
                </div>
                
                <div className="space-y-3.5">
                  {summary.topCategories.length > 0 ? (
                    summary.topCategories.map((cat, i) => {
                      const percent = summary.totalDebit > 0 
                        ? Math.min(Math.round((cat.amount / summary.totalDebit) * 100), 100) 
                        : 0;
                      return (
                        <div key={i} className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-foreground/70 truncate mr-2 font-medium">{cat.category}</span>
                            <span className="font-bold text-white shrink-0 font-mono">₹{cat.amount.toLocaleString("en-IN")}</span>
                          </div>
                          
                          {/* Accent sliding loader bar */}
                          <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-accent rounded-full shadow-[0_0_6px_rgba(108,127,255,0.45)]"
                              initial={{ width: 0 }}
                              animate={{ width: `${percent}%` }}
                              transition={{ type: "spring", stiffness: 85, damping: 15, delay: 0.1 }}
                            />
                          </div>
                          
                          <div className="flex justify-end">
                            <span className="text-[8px] text-foreground/30 font-bold font-sans tracking-wide uppercase">{percent}% of spent</span>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-[9px] text-foreground/30 italic font-sans">No category data summarized.</p>
                  )}
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-3 border-t border-border/20 flex items-center justify-between text-[9px] text-foreground/30 font-medium font-sans">
                <div className="flex items-center gap-1">
                  <Receipt size={10} />
                  {summary.transactionCount} transactions
                </div>
                <span>Updated {new Date(summary.lastUpdated).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

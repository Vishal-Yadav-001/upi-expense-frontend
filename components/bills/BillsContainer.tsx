"use client";

import React from "react";
import { 
  CreditCard, 
  Calendar, 
  Clock, 
  AlertTriangle, 
  Loader2, 
  Sparkles, 
  CheckCircle2, 
  ShieldAlert,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Upload
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@apollo/client/react";
import { GET_SUBSCRIPTIONS, SubscriptionsData } from "@/lib/queries";
import { usePrivacy } from "@/context/PrivacyContext";
import { maskName } from "@/lib/privacy";
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

export function BillsContainer() {
  const { isPrivacyEnabled, hasHydrated } = usePrivacy();

  const { data, loading, error, refetch } = useQuery<SubscriptionsData>(GET_SUBSCRIPTIONS, {
    variables: { days: 30, limit: 15 },
    notifyOnNetworkStatusChange: true,
  });

  const subs = data?.detectSubscriptions || [];
  const upcoming = data?.upcomingSubscriptions || [];
  const topRecurring = data?.topRecurringPayees || [];

  const getMaskedEntity = (name: string) => {
    if (isPrivacyEnabled && hasHydrated) {
      return maskName(name);
    }
    return name;
  };

  const formatAmount = (amount: number, forceColor = false) => {
    const absAmount = Math.abs(amount).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    return (
      <span className={cn("font-mono font-bold", forceColor ? "text-accent" : "text-foreground")}>
        ₹{absAmount}
      </span>
    );
  };

  const getUrgencyClass = (relativeDays: number) => {
    if (relativeDays <= 1) {
      // Immediate draft: Today or Tomorrow
      return "bg-destructive/10 text-destructive border border-destructive/20 shadow-[0_0_8px_rgba(255,77,77,0.12)] font-extrabold";
    }
    if (relativeDays <= 7) {
      // Within 2-7 days
      return "bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold";
    }
    // Buffer days
    return "bg-teal-soft/10 text-teal border border-teal/20 font-bold";
  };

  // Calculate totals
  const totalMonthlyCommitment = subs.reduce((sum, s) => {
    if (s.frequency === "MONTHLY") return sum + s.avgAmount;
    if (s.frequency === "WEEKLY") return sum + s.avgAmount * 4;
    return sum;
  }, 0);

  const avgConfidence = subs.length > 0
    ? Math.round((subs.reduce((sum, s) => sum + s.confidence, 0) / subs.length) * 100)
    : 0;

  if (loading && !data) {
    return (
      <div className="flex justify-center py-24 flex-col items-center gap-4">
        <Loader2 size={36} className="animate-spin text-accent" />
        <p className="text-xs text-foreground/40 font-medium tracking-wide">Detecting transaction mandates & recurring intervals...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-10 bg-card/30 border border-border/50 rounded-2xl text-destructive/80 text-center space-y-4 max-w-lg mx-auto">
        <ShieldAlert size={44} strokeWidth={1.5} className="text-destructive animate-pulse" />
        <h3 className="font-heading font-bold text-base text-white">Subscriptions Analysis Failed</h3>
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

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Dynamic Header Refresh & Upload Controls */}
      <div className="flex justify-end -mt-16 sm:-mt-20 relative z-20 gap-3">
        <Link
          href="/imports"
          className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent/90 border border-accent/20 text-background rounded-xl text-xs font-bold uppercase transition-all shadow-lg shadow-accent/15 hover:shadow-accent/25 hover:-translate-y-0.5 cursor-pointer font-sans"
        >
          <Upload size={13} />
          <span>Upload Statement</span>
        </Link>

        <motion.button
          onClick={() => refetch()}
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-border/60 hover:border-accent/40 text-foreground/60 hover:text-white rounded-xl text-xs font-bold uppercase transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 size={13} className="animate-spin text-accent" /> : <Clock size={13} />}
          <span>Refresh Analysis</span>
        </motion.button>
      </div>

      {/* Summary Bento Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Monthly Commitments */}
        <motion.div variants={item} className="bg-card/40 border border-border/50 backdrop-blur-md p-6 rounded-2xl flex flex-col justify-between hover:border-accent/30 transition-all shadow-lg">
          <div>
            <span className="text-[10px] text-foreground/40 font-bold uppercase tracking-wider">Est. Monthly Mandates</span>
            <h3 className="text-2xl font-bold mt-1 text-white">
              {formatAmount(totalMonthlyCommitment, true)}
            </h3>
          </div>
          <div className="mt-4 text-[9px] text-foreground/30 font-medium uppercase tracking-wider flex items-center gap-1.5 border-t border-border/30 pt-3">
            <Sparkles size={10} className="text-accent animate-pulse" />
            Aggregated from active cycles
          </div>
        </motion.div>

        {/* Upcoming Bills Count */}
        <motion.div variants={item} className="bg-card/40 border border-border/50 backdrop-blur-md p-6 rounded-2xl flex flex-col justify-between hover:border-teal/30 transition-all shadow-lg">
          <div>
            <span className="text-[10px] text-foreground/40 font-bold uppercase tracking-wider">Due in Next 30 Days</span>
            <h3 className="text-2xl font-bold mt-1 text-white">
              {upcoming.length} commitments
            </h3>
          </div>
          <div className="mt-4 text-[9px] text-foreground/30 font-medium uppercase tracking-wider flex items-center gap-1.5 border-t border-border/30 pt-3">
            <Calendar size={10} className="text-teal" />
            Automatic detection calendar
          </div>
        </motion.div>

        {/* AI Confidence Meter */}
        <motion.div variants={item} className="bg-card/40 border border-border/50 backdrop-blur-md p-6 rounded-2xl flex flex-col justify-between hover:border-accent/30 transition-all shadow-lg">
          <div>
            <span className="text-[10px] text-foreground/40 font-bold uppercase tracking-wider">AI Detection Accuracy</span>
            <div className="flex items-baseline gap-2 mt-1">
              <h3 className="text-2xl font-bold text-white">{avgConfidence}%</h3>
              <span className="text-[9px] px-2 py-0.5 rounded bg-teal-soft/10 text-teal font-extrabold flex items-center gap-0.5 uppercase border border-teal/20 tracking-wider">
                <CheckCircle2 size={10} /> High
              </span>
            </div>
          </div>
          <div className="mt-4 text-[9px] text-foreground/30 font-medium uppercase tracking-wider flex items-center gap-1.5 border-t border-border/30 pt-3">
            <Sparkles size={10} className="text-accent" />
            Aggregating {subs.length} periodic models
          </div>
        </motion.div>
      </div>

      {/* Core Content Bento Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col - Detected Subscriptions */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-accent animate-pulse" />
            <h3 className="font-heading font-bold text-white text-sm">Active Subscriptions</h3>
            <span className="text-[9px] bg-accent/10 border border-accent/20 text-accent px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">AI Detected</span>
          </div>

          {subs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {subs.map((sub, i) => (
                <motion.div
                  key={i}
                  variants={item}
                  whileHover={{ y: -3, borderColor: "rgba(108, 127, 255, 0.3)" }}
                  className="bg-card/30 border border-border/50 p-5 rounded-2xl space-y-4 hover:shadow-xl hover:shadow-accent/[0.02] transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="font-heading font-bold text-white truncate text-sm">
                        {getMaskedEntity(sub.payee.displayName)}
                      </h4>
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/5 border border-border/40 text-foreground/50 uppercase font-bold tracking-wider shrink-0">
                        {sub.frequency}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-xs border-b border-border/30 pb-3">
                      <span className="text-foreground/40 font-medium">Average cost</span>
                      <span className="font-bold text-white">{formatAmount(sub.avgAmount)}</span>
                    </div>
                  </div>

                  <div className="space-y-2.5 pt-1">
                    {/* Cost Warn Alert Blocks */}
                    {sub.priceChange !== undefined && sub.priceChange !== null && sub.priceChange !== 0 && (
                      <div className={cn(
                        "flex items-center gap-1.5 text-[9px] px-2.5 py-1.5 rounded-lg border font-medium font-sans tracking-wide",
                        sub.priceChange > 0
                          ? "bg-destructive-soft border-destructive/20 text-destructive"
                          : "bg-teal-soft/5 border-teal/20 text-teal"
                      )}>
                        {sub.priceChange > 0 ? (
                          <>
                            <TrendingUp size={11} className="shrink-0 animate-pulse" />
                            <span>Price increase: +{sub.priceChange}% warning</span>
                          </>
                        ) : (
                          <>
                            <TrendingDown size={11} className="shrink-0" />
                            <span>Price decrease: {sub.priceChange}% saving</span>
                          </>
                        )}
                      </div>
                    )}

                    {/* AI Confidence Meter */}
                    <div className="flex items-center justify-between text-[10px] text-foreground/30 font-medium">
                      <span>AI Confidence</span>
                      <div className="flex items-center gap-1.5">
                        <div className="w-16 h-1 bg-white/5 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-teal rounded-full shadow-[0_0_6px_rgba(46,232,181,0.4)]"
                            initial={{ width: 0 }}
                            animate={{ width: `${sub.confidence * 100}%` }}
                            transition={{ type: "spring", stiffness: 80, damping: 15, delay: 0.15 }}
                          />
                        </div>
                        <span className="font-bold text-teal text-[9px]">{Math.round(sub.confidence * 100)}%</span>
                      </div>
                    </div>

                    {/* Last active billing */}
                    {sub.lastPaidAt && (
                      <div className="text-[9px] text-foreground/30 font-medium pt-1 font-sans border-t border-border/10">
                        Last billing: {new Date(sub.lastPaidAt).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric"
                        })}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="p-12 border border-border/50 border-dashed rounded-3xl bg-card/25 text-foreground/20 text-center flex flex-col items-center justify-center min-h-[320px] relative overflow-hidden">
              <div className="absolute inset-0 bg-radial-gradient from-accent/5 via-transparent to-transparent opacity-30 blur-2xl pointer-events-none" />
              
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="mb-4 text-accent/30 w-14 h-14 rounded-full bg-accent/5 border border-accent/15 flex items-center justify-center shadow-lg shadow-accent/5"
              >
                <CreditCard size={24} />
              </motion.div>
              
              <p className="text-sm font-bold text-foreground">No recurring subscriptions detected yet.</p>
              <p className="text-[10px] uppercase tracking-widest mt-1.5 text-foreground/30 max-w-xs font-medium font-sans leading-relaxed">
                Upload bank or wallet statements containing periodic bills to seed analysis model mandates
              </p>
              
              <div className="mt-6">
                <Link
                  href="/imports"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-accent hover:bg-accent/90 text-background rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all shadow-lg shadow-accent/15 hover:shadow-accent/25 hover:-translate-y-0.5 cursor-pointer"
                >
                  <span>Upload Statement</span>
                  <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Right Col - Upcoming Commitments & Top Recurring */}
        <div className="space-y-8">
          
          {/* Upcoming Bills Ledger */}
          <div className="space-y-4">
            <h3 className="font-heading font-bold text-white text-sm flex items-center gap-2">
              <Clock size={16} className="text-teal" />
              Upcoming Bills
            </h3>
            
            {upcoming.length > 0 ? (
              <div className="space-y-3">
                {upcoming.map((up, i) => {
                  const expected = new Date(up.expectedDate);
                  const relativeDays = Math.round((expected.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                  const relativeText = relativeDays === 0
                    ? "Today"
                    : relativeDays === 1
                      ? "Tomorrow"
                      : `In ${relativeDays} days`;

                  return (
                    <motion.div
                      key={i}
                      variants={item}
                      className="bg-card/40 border border-border/50 p-4 rounded-xl flex items-center justify-between hover:bg-white/[0.01] hover:border-border/85 transition-all"
                    >
                      <div className="space-y-1.5 truncate mr-2">
                        <h4 className="text-xs font-bold text-white truncate">
                          {getMaskedEntity(up.payee.displayName)}
                        </h4>
                        
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] text-foreground/40 font-medium">
                            Due {expected.toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                          </span>
                          <span className={cn("text-[8px] px-1.5 py-0.5 rounded uppercase tracking-wider border", getUrgencyClass(relativeDays))}>
                            {relativeText}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-white shrink-0">{formatAmount(up.avgAmount)}</span>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 border border-border/50 rounded-2xl bg-card/25 text-foreground/20 text-center text-xs font-medium font-sans">
                No bills expected in the next 30 days.
              </div>
            )}
          </div>

          {/* Top commitments periodic list */}
          <div className="space-y-4">
            <h3 className="font-heading font-bold text-white text-sm flex items-center gap-2">
              <Calendar size={16} className="text-accent" />
              Top Commitments
            </h3>

            {topRecurring.length > 0 ? (
              <div className="bg-card/30 border border-border/50 rounded-2xl overflow-hidden divide-y divide-border/20 shadow-lg">
                {topRecurring.map((tr, i) => (
                  <div key={i} className="p-4 flex items-center justify-between text-xs hover:bg-white/[0.01] transition-all">
                    <div className="space-y-1 truncate mr-2">
                      <h4 className="font-bold text-white truncate text-xs">
                        {getMaskedEntity(tr.payee.displayName)}
                      </h4>
                      <p className="text-[9px] text-foreground/40 font-medium font-sans">
                        {tr.transactionCount} billing events detected
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-bold block text-white">{formatAmount(tr.totalAmount)}</span>
                      <span className="text-[8px] text-foreground/30 uppercase font-bold tracking-wider">Total spent</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 border border-border/50 rounded-2xl bg-card/25 text-foreground/20 text-center text-xs font-medium font-sans">
                No transaction recurrence trends analyzed.
              </div>
            )}
          </div>

        </div>

      </div>
    </motion.div>
  );
}

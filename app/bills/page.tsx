"use client";

import React from "react";
import { CreditCard, Calendar, Clock, AlertTriangle, Loader2, Sparkles, CheckCircle2, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "@apollo/client/react";
import { GET_SUBSCRIPTIONS, SubscriptionsData } from "@/lib/queries";
import { usePrivacy } from "@/context/PrivacyContext";
import { maskName } from "@/lib/privacy";
import { cn } from "@/lib/utils";

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

export default function BillsPage() {
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
    const isMasked = isPrivacyEnabled && hasHydrated;
    const absAmount = Math.abs(amount).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    if (isMasked) {
      return <span className="font-mono">₹{absAmount.replace(/\d/g, "*")}</span>;
    }

    return (
      <span className={cn("font-mono font-bold", forceColor ? "text-accent" : "text-foreground")}>
        ₹{absAmount}
      </span>
    );
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

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="h-full overflow-y-auto p-6 space-y-8 pb-20"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-accent/10 text-accent rounded-xl border border-accent/20">
            <CreditCard size={22} />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-foreground">Subscriptions & Bills</h2>
            <p className="text-[10px] text-foreground/40 font-bold uppercase tracking-[0.2em]">Manage your recurring commitments</p>
          </div>
        </div>

        <button
          onClick={() => refetch()}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/5 hover:bg-white/10 text-foreground/60 hover:text-white rounded-xl text-xs font-bold uppercase transition-all"
        >
          {loading ? <Loader2 size={14} className="animate-spin" /> : <Clock size={14} />}
          <span>Refresh Analysis</span>
        </button>
      </div>

      {loading && !data ? (
        <div className="flex justify-center py-20 flex-col items-center gap-4">
          <Loader2 size={36} className="animate-spin text-accent" />
          <p className="text-sm text-foreground/40 font-medium">Detecting transaction mandates & recurring intervals...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center p-8 bg-card border border-border rounded-2xl text-destructive/80 text-center space-y-3">
          <ShieldAlert size={48} strokeWidth={1.5} />
          <h3 className="font-heading font-bold text-lg">Subscriptions analysis failed</h3>
          <p className="text-sm max-w-md">{error.message}</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-destructive/10 hover:bg-destructive/20 border border-destructive/25 rounded-xl text-xs font-bold uppercase transition-all"
          >
            Try Again
          </button>
        </div>
      ) : (
        <>
          {/* Summary Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total Monthly Commitments */}
            <motion.div variants={item} className="bg-card border border-border p-6 rounded-2xl flex flex-col justify-between animate-in fade-in slide-in-from-bottom duration-300">
              <div>
                <span className="text-[10px] text-foreground/40 font-bold uppercase tracking-wider">Est. Monthly Mandates</span>
                <h3 className="text-2xl font-bold mt-1 text-foreground">
                  {formatAmount(totalMonthlyCommitment, true)}
                </h3>
              </div>
              <div className="mt-4 text-[9px] text-foreground/30 font-medium uppercase tracking-wider flex items-center gap-1.5 border-t border-border/50 pt-3">
                <Sparkles size={10} className="text-accent" />
                Aggregated from active cycles
              </div>
            </motion.div>

            {/* Upcoming Bills Count */}
            <motion.div variants={item} className="bg-card border border-border p-6 rounded-2xl flex flex-col justify-between animate-in fade-in slide-in-from-bottom duration-300">
              <div>
                <span className="text-[10px] text-foreground/40 font-bold uppercase tracking-wider">Due in Next 30 Days</span>
                <h3 className="text-2xl font-bold mt-1 text-foreground">
                  {upcoming.length} commitments
                </h3>
              </div>
              <div className="mt-4 text-[9px] text-foreground/30 font-medium uppercase tracking-wider flex items-center gap-1.5 border-t border-border/50 pt-3">
                <Calendar size={10} className="text-teal" />
                Automatic detection calendar
              </div>
            </motion.div>

            {/* AI Confidence Meter */}
            <motion.div variants={item} className="bg-card border border-border p-6 rounded-2xl flex flex-col justify-between animate-in fade-in slide-in-from-bottom duration-300">
              <div>
                <span className="text-[10px] text-foreground/40 font-bold uppercase tracking-wider">AI Detection Accuracy</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <h3 className="text-2xl font-bold text-foreground">{avgConfidence}%</h3>
                  <span className="text-xs text-teal font-bold flex items-center gap-0.5">
                    <CheckCircle2 size={12} /> High
                  </span>
                </div>
              </div>
              <div className="mt-4 text-[9px] text-foreground/30 font-medium uppercase tracking-wider flex items-center gap-1.5 border-t border-border/50 pt-3">
                <Sparkles size={10} className="text-accent" />
                Aggregating {subs.length} periodic models
              </div>
            </motion.div>
          </div>

          {/* Core Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Col - Detected Subscriptions */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={16} className="text-accent" />
                <h3 className="font-heading font-bold text-foreground">Active Subscriptions</h3>
                <span className="text-[9px] bg-accent/10 border border-accent/20 text-accent px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">AI Detected</span>
              </div>

              {subs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {subs.map((sub, i) => (
                    <motion.div
                      key={i}
                      variants={item}
                      whileHover={{ y: -4, borderColor: "rgba(129, 140, 248, 0.4)" }}
                      className="bg-card border border-border p-5 rounded-2xl space-y-4 hover:shadow-2xl hover:shadow-accent/5 transition-all flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="font-heading font-bold text-foreground truncate group-hover:text-white transition-colors">
                            {getMaskedEntity(sub.payee.displayName)}
                          </h4>
                          <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/5 border border-white/5 text-foreground/50 uppercase font-bold tracking-wider shrink-0">
                            {sub.frequency}
                          </span>
                        </div>

                        <div className="flex justify-between items-center text-xs border-b border-border/30 pb-3">
                          <span className="text-foreground/40 font-medium">Average cost</span>
                          <span className="font-bold text-foreground">{formatAmount(sub.avgAmount)}</span>
                        </div>
                      </div>

                      <div className="space-y-2.5 pt-2">
                        {sub.priceChange && (
                          <div className="flex items-center gap-1.5 text-[10px] bg-amber-500/10 border border-amber-500/20 text-amber-400 px-2.5 py-1 rounded-lg">
                            <AlertTriangle size={12} />
                            <span>Price change detected: {sub.priceChange > 0 ? "+" : ""}{sub.priceChange}%</span>
                          </div>
                        )}

                        <div className="flex items-center justify-between text-[10px] text-foreground/30 font-medium">
                          <span>AI Confidence</span>
                          <div className="flex items-center gap-1">
                            <div className="w-16 h-1 bg-white/5 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-teal rounded-full"
                                style={{ width: `${sub.confidence * 100}%` }}
                              />
                            </div>
                            <span className="font-bold text-teal">{Math.round(sub.confidence * 100)}%</span>
                          </div>
                        </div>

                        {sub.lastPaidAt && (
                          <div className="text-[9px] text-foreground/30 font-medium pt-1">
                            Last active billing: {new Date(sub.lastPaidAt).toLocaleDateString("en-IN", {
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
                <div className="p-12 border border-border border-dashed rounded-3xl bg-card text-foreground/20 text-center flex flex-col items-center justify-center min-h-[300px]">
                  <CreditCard size={48} strokeWidth={1} className="mb-4 text-foreground/10" />
                  <p className="text-sm font-medium">No recurring subscriptions detected yet.</p>
                  <p className="text-[10px] uppercase tracking-widest mt-1 text-foreground/40">Upload bank or wallet statements containing periodic billing</p>
                </div>
              )}
            </div>

            {/* Right Col - Upcoming Commitments & Top Recurring */}
            <div className="space-y-8">
              
              {/* Upcoming Mandates */}
              <div>
                <h3 className="font-heading font-bold text-foreground mb-4 flex items-center gap-2">
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
                          className="bg-card border border-border p-4 rounded-xl flex items-center justify-between hover:bg-white/[0.01] transition-colors"
                        >
                          <div className="space-y-1">
                            <h4 className="text-xs font-bold text-foreground">
                              {getMaskedEntity(up.payee.displayName)}
                            </h4>
                            <p className="text-[9px] text-foreground/40 font-medium">
                              Due {expected.toLocaleDateString("en-IN", { day: "2-digit", month: "short" })} • <span className="text-teal font-bold">{relativeText}</span>
                            </p>
                          </div>
                          <span className="text-xs font-bold text-foreground">{formatAmount(up.avgAmount)}</span>
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-8 border border-border rounded-2xl bg-card text-foreground/20 text-center text-xs">
                    No bills expected in the next 30 days.
                  </div>
                )}
              </div>

              {/* Top Recurring Payees */}
              <div>
                <h3 className="font-heading font-bold text-foreground mb-4 flex items-center gap-2">
                  <Calendar size={16} className="text-accent" />
                  Top Commitments
                </h3>

                {topRecurring.length > 0 ? (
                  <div className="bg-card border border-border rounded-2xl overflow-hidden divide-y divide-border/30">
                    {topRecurring.map((tr, i) => (
                      <div key={i} className="p-4 flex items-center justify-between text-xs hover:bg-white/[0.01] transition-all">
                        <div className="space-y-1 truncate mr-2">
                          <h4 className="font-bold text-foreground truncate">
                            {getMaskedEntity(tr.payee.displayName)}
                          </h4>
                          <p className="text-[9px] text-foreground/40 font-medium">
                            {tr.transactionCount} billing events
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="font-bold block text-foreground">{formatAmount(tr.totalAmount)}</span>
                          <span className="text-[9px] text-foreground/30">Total spent</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 border border-border rounded-2xl bg-card text-foreground/20 text-center text-xs">
                    No transaction recurrence trends analyzed.
                  </div>
                )}
              </div>

            </div>

          </div>
        </>
      )}
    </motion.div>
  );
}

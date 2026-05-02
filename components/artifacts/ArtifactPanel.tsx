"use client";

import { SummaryBar } from "./SummaryBar";
import { TransactionAudit } from "./TransactionAudit";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { Sparkles, AlertCircle, TrendingUp, History } from "lucide-react";
import { useDashboard } from "@/hooks/useDashboard";
import { usePrivacy } from "@/context/PrivacyContext";
import { maskName } from "@/lib/privacy";

const MonthlySpendChart = dynamic(() => import("./MonthlySpendChart").then(mod => mod.MonthlySpendChart), {
  ssr: false,
  loading: () => <div className="bg-card border border-border p-6 rounded-2xl h-[400px] animate-pulse" />
});

export const ArtifactPanel = () => {
  const { monthlySpend, upcomingSubscriptions, transactions, recentExpenses, loading, error } = useDashboard();
  const { isPrivacyEnabled } = usePrivacy();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const totalSpend = monthlySpend.reduce((acc: number, curr: any) => acc + curr.total, 0);

  // Decide what to show in the Audit section
  const hasAuditData = transactions.length > 0;
  const auditData = hasAuditData ? transactions : recentExpenses;
  const isRecentExpenses = !hasAuditData && recentExpenses.length > 0;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-foreground/50 gap-4 p-8 text-center">
        <AlertCircle size={48} className="text-red-500/50" />
        <p>Failed to load dashboard data.<br />Ensure the backend is running at http://localhost:4000</p>
      </div>
    );
  }

  if (!isMounted) return null;

  return (
    <div className="flex flex-col h-full bg-background/50 p-6 overflow-y-auto">
      {/* Dashboard Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary/10 text-primary rounded-xl border border-primary/20">
            <Sparkles size={22} />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight">Command Center</h2>
            <p className="text-[10px] text-foreground/40 font-bold uppercase tracking-[0.2em]">Autonomous Financial Engine</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-full border border-border/50">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-bold text-foreground/50 uppercase tracking-widest">System Online</span>
        </div>
      </div>

      {/* Bento Grid Summary */}
      <SummaryBar 
        totalSpend={totalSpend} 
        upcomingCount={upcomingSubscriptions.length} 
        activeMandates={5}
        loading={loading}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Main Chart Section */}
        <div className="lg:col-span-2">
          <MonthlySpendChart data={monthlySpend} loading={loading} />
        </div>
        
        {/* Secondary Info Section */}
        <div className="space-y-6">
          {/* Upcoming Bills Widget */}
          <div className="bg-card border border-border p-6 rounded-2xl h-full">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <TrendingUp size={16} className="text-primary" />
                <h3 className="font-bold text-sm uppercase tracking-wider">Upcoming</h3>
              </div>
            </div>

            {loading ? (
              <div className="space-y-4 animate-pulse">
                {[1, 2, 3, 4].map(i => <div key={i} className="h-10 bg-background rounded-xl" />)}
              </div>
            ) : upcomingSubscriptions.length === 0 ? (
              <p className="text-xs text-foreground/30 italic py-8 text-center">No upcoming bills detected.</p>
            ) : (
              <div className="space-y-3">
                {upcomingSubscriptions.map((sub: any, i: number) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-background/40 rounded-xl border border-border/50 group hover:border-primary/30 transition-colors">
                    <div className="flex gap-3 items-center">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full group-hover:scale-125 transition-transform" />
                      <span className="text-xs font-semibold text-foreground/80">
                        {isPrivacyEnabled ? maskName(sub.payee.displayName) : sub.payee.displayName}
                      </span>
                    </div>
                    <span className="text-[10px] text-foreground/40 font-mono font-bold">
                      {new Date(sub.expectedDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Transaction Audit Table */}
      <div className="mt-2">
        <div className="flex items-center gap-2 mb-4">
          <History size={16} className="text-foreground/30" />
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-foreground/40">Audit Trail</h3>
        </div>
        <TransactionAudit 
          transactions={auditData} 
          loading={loading} 
          isRecentExpenses={isRecentExpenses}
        />
      </div>
    </div>
  );
};

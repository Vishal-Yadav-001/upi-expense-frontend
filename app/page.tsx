"use client";

import React from "react";
import { useDashboard } from "@/hooks/useDashboard";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { SpendingChart } from "@/components/dashboard/SpendingChart";
import { TransactionAudit, Transaction } from "@/components/dashboard/TransactionAudit";
import { Wallet, CreditCard, TrendingUp, AlertCircle } from "lucide-react";

export default function DashboardPage() {
  const { 
    monthlySpend, 
    upcomingSubscriptions, 
    transactions, 
    loading, 
    error 
  } = useDashboard();

  if (error) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-foreground/40">
        <AlertCircle size={48} strokeWidth={1} className="mb-4" />
        <h3 className="font-heading font-bold text-lg">Error loading dashboard</h3>
        <p className="text-sm">Please check your connection and try again.</p>
      </div>
    );
  }

  // Calculate metrics
  const currentMonthSpend = monthlySpend.length > 0 
    ? monthlySpend[monthlySpend.length - 1].total 
    : 0;
  
  const activeSubsCount = upcomingSubscriptions.length;
  
  // Transform transactions for the audit table
  const transformedTransactions: Transaction[] = transactions.map(tx => ({
    id: tx.id,
    entity: tx.payee.displayName,
    category: tx.payee.category,
    date: new Date(tx.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
    amount: tx.amount,
    direction: tx.direction as "IN" | "OUT"
  }));

  // Transform spending data for chart
  // In a real app, we might want to calculate 'projected' more accurately
  const spendingData = monthlySpend.map(ms => ({
    month: ms.month,
    historical: ms.total,
    projected: ms.total // Mock projection as same for now
  }));

  return (
    <div className="h-full overflow-y-auto p-6 space-y-8 pb-20">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard 
          label="Total Monthly Spend" 
          value={`₹${currentMonthSpend.toLocaleString('en-IN')}`}
          icon={Wallet}
          trend={{ value: 12, isPositive: false }}
          accentColor="accent"
        />
        <MetricCard 
          label="Active Subscriptions" 
          value={activeSubsCount}
          icon={CreditCard}
          accentColor="teal"
        />
        <MetricCard 
          label="Estimated Monthly Savings" 
          value="₹4,200"
          icon={TrendingUp}
          trend={{ value: 8, isPositive: true }}
          accentColor="teal"
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <SpendingChart data={spendingData} loading={loading} />
        <TransactionAudit transactions={transformedTransactions} />
      </div>
    </div>
  );
}

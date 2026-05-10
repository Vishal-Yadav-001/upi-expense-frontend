"use client";

import React from "react";
import { useDashboard } from "@/hooks/useDashboard";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { BudgetCard } from "@/components/dashboard/BudgetCard";
import { SpendingChart } from "@/components/dashboard/SpendingChart";
import { TransactionAudit, Transaction } from "@/components/dashboard/TransactionAudit";
import { Wallet, CreditCard, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function DashboardPage() {
  const { 
    monthlySpend, 
    upcomingSubscriptions, 
    transactions,
    monthlyBudget,
    updateBudget, 
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
  const transformedTransactions: Transaction[] = transactions.map(tx => {
    // Robust date parsing (handles ISO strings and Unix timestamps as string/number)
    let dateObj: Date;
    
    if (!isNaN(Number(tx.date))) {
      dateObj = new Date(Number(tx.date));
    } else {
      dateObj = new Date(tx.date);
    }

    const formattedDate = !isNaN(dateObj.getTime()) 
      ? dateObj.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
      : tx.date; // Fallback to raw string if parsing fails

    return {
      id: tx.id,
      payeeId: tx.payee.id,
      entity: tx.payee.displayName,
      category: tx.payee.category,
      date: formattedDate,
      amount: tx.amount,
      direction: tx.direction === "CREDIT" ? "IN" : "OUT"
    };
  });

  // Transform spending data for chart
  const spendingData = monthlySpend.map(ms => ({
    month: ms.month,
    historical: ms.total,
    projected: ms.total
  }));

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="h-full overflow-y-auto p-6 space-y-8 pb-20"
    >
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div variants={item}>
          <MetricCard 
            label="Total Monthly Spend" 
            value={`₹${currentMonthSpend.toLocaleString('en-IN')}`}
            icon={Wallet}
            trend={{ value: 12, isPositive: false }}
            accentColor="accent"
          />
        </motion.div>
        <motion.div variants={item}>
          <MetricCard 
            label="Active Subscriptions" 
            value={activeSubsCount}
            icon={CreditCard}
            accentColor="teal"
          />
        </motion.div>
        <motion.div variants={item}>
          <BudgetCard 
            budget={monthlyBudget}
            spent={currentMonthSpend}
            onUpdate={updateBudget}
          />
        </motion.div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div variants={item}>
          <SpendingChart data={spendingData} loading={loading} />
        </motion.div>
        <motion.div variants={item}>
          <TransactionAudit transactions={transformedTransactions} />
        </motion.div>
      </div>
    </motion.div>
  );
}

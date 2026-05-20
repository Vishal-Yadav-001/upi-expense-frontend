"use client";

import React from "react";
import { CreditCard, Clock } from "lucide-react";
import { motion } from "framer-motion";

export default function BillsPage() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full overflow-y-auto p-6 space-y-8 pb-20"
    >
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-accent/10 text-accent rounded-xl border border-accent/20">
          <CreditCard size={22} />
        </div>
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">Subscriptions & Bills</h2>
          <p className="text-[10px] text-foreground/40 font-bold uppercase tracking-[0.2em]">Manage your recurring commitments</p>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center py-40 bg-card border border-border border-dashed rounded-3xl text-foreground/20">
        <div className="p-4 bg-white/5 rounded-full mb-4">
          <Clock size={48} strokeWidth={1} />
        </div>
        <p className="text-sm font-medium">Coming Soon</p>
        <p className="text-[10px] uppercase tracking-[0.2em] mt-2 text-foreground/40 text-center max-w-xs">
          We are building the intelligence to automatically detect your recurring UPI mandates and monthly bills.
        </p>
      </div>
    </motion.div>
  );
}

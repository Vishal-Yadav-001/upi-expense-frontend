"use client";

import React from "react";
import { ListFilter, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function TransactionsPage() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full overflow-y-auto p-6 space-y-8 pb-20"
    >
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-teal/10 text-teal rounded-xl border border-teal/20">
          <ListFilter size={22} />
        </div>
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">Transaction Ledger</h2>
          <p className="text-[10px] text-foreground/40 font-bold uppercase tracking-[0.2em]">Detailed Audit Trail</p>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center py-20 bg-card border border-border rounded-2xl text-foreground/20">
        <AlertCircle size={48} strokeWidth={1} className="mb-4" />
        <p className="text-sm font-medium">Full transaction history is being indexed.</p>
      </div>
    </motion.div>
  );
}

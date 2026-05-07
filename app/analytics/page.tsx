"use client";

import React from "react";
import { TrendingUp, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function AnalyticsPage() {
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
          <p className="text-[10px] text-foreground/40 font-bold uppercase tracking-[0.2em]">Deep Insights & Projections</p>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center py-20 bg-card border border-border rounded-2xl text-foreground/20">
        <AlertCircle size={48} strokeWidth={1} className="mb-4" />
        <p className="text-sm font-medium">Analytics modules are being initialized.</p>
      </div>
    </motion.div>
  );
}

"use client";

import React from "react";
import { usePinnedInsights } from "@/context/PinnedInsightsContext";
import { MonthlySpendChart } from "@/components/chat/MonthlySpendChart";
import { CategorySpendChart } from "@/components/chat/CategorySpendChart";
import { Pin, X, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const PinnedInsights = () => {
  const { pinnedInsights, unpinInsight } = usePinnedInsights();

  if (pinnedInsights.length === 0) return null;

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
          <Sparkles size={18} />
        </div>
        <div>
          <h3 className="text-sm font-bold font-heading uppercase tracking-wider text-foreground/80">
            AI Insights
          </h3>
          <p className="text-[10px] text-foreground/40 font-bold uppercase tracking-[0.2em]">
            Pinned from Chat · {pinnedInsights.length} {pinnedInsights.length === 1 ? "chart" : "charts"}
          </p>
        </div>
      </div>

      {/* Pinned Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AnimatePresence mode="popLayout">
          {pinnedInsights.map((insight) => (
            <motion.div
              key={insight.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", damping: 20, stiffness: 200 }}
              className="relative group"
            >
              {/* Unpin Button */}
              <button
                onClick={() => unpinInsight(insight.id)}
                title="Unpin from Dashboard"
                className="absolute top-3 right-3 z-10 p-1.5 rounded-lg bg-card/90 border border-border text-foreground/30 hover:text-destructive hover:border-destructive/30 transition-all cursor-pointer opacity-0 group-hover:opacity-100"
              >
                <X size={14} />
              </button>

              {/* Pinned Badge */}
              <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-2 py-1 rounded-lg bg-accent/10 border border-accent/20 text-accent text-[10px] font-bold uppercase tracking-wider">
                <Pin size={10} className="fill-accent" />
                {insight.label}
              </div>

              {/* Chart */}
              {(insight.type === "monthly_spend" || insight.type === "velocity") && (
                <MonthlySpendChart data={insight.data} />
              )}
              {insight.type === "category_spend" && (
                <CategorySpendChart data={insight.data} />
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

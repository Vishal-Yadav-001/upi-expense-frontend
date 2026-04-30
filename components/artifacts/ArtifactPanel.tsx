"use client";

import { SummaryBar } from "./SummaryBar";
import { MonthlySpendChart } from "./MonthlySpendChart";
import { Sparkles } from "lucide-react";

export const ArtifactPanel = () => {
  return (
    <div className="flex flex-col h-full bg-background/50 p-6 overflow-y-auto">
      <div className="flex items-center gap-2 mb-8">
        <div className="p-2 bg-primary/10 text-primary rounded-lg">
          <Sparkles size={20} />
        </div>
        <div>
          <h2 className="text-xl font-bold tracking-tight">AI Insights</h2>
          <p className="text-xs text-foreground/50 font-medium uppercase tracking-wider">Analysis of your finances</p>
        </div>
      </div>

      <SummaryBar />
      
      <div className="grid grid-cols-1 gap-6">
        <MonthlySpendChart />
        
        <div className="bg-card border border-border p-6 rounded-2xl">
          <h3 className="font-bold text-lg mb-4">Key Observations</h3>
          <ul className="space-y-4">
            <li className="flex gap-3">
              <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0" />
              <p className="text-sm text-foreground/70 leading-relaxed">
                Your spending on <span className="text-foreground font-bold italic">Subscriptions</span> increased by 15% this month.
              </p>
            </li>
            <li className="flex gap-3">
              <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2 shrink-0" />
              <p className="text-sm text-foreground/70 leading-relaxed">
                You&apos;ve saved <span className="text-accent font-bold">₹1,200</span> compared to last month by reducing dining out.
              </p>
            </li>
            <li className="flex gap-3">
              <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0" />
              <p className="text-sm text-foreground/70 leading-relaxed">
                Upcoming bill for <span className="text-foreground font-bold">Netflix</span> on May 5th.
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

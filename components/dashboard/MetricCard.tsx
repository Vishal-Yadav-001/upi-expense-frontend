"use client";

import React from "react";
import { LucideIcon } from "lucide-react";
import { usePrivacy } from "@/context/PrivacyContext";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  accentColor?: "accent" | "teal";
  loading?: boolean;
}

export const MetricCard = ({
  label,
  value,
  icon: Icon,
  trend,
  accentColor = "accent",
  loading = false,
}: MetricCardProps) => {
  const { isPrivacyEnabled, hasHydrated } = usePrivacy();

  if (loading) {
    return (
      <div className={cn(
        "relative overflow-hidden rounded-xl bg-card border border-border p-5 transition-all",
        "border-t-2 animate-pulse",
        accentColor === "accent" 
          ? "border-t-accent/50 shadow-[0_-1px_10px_-4px_rgba(108,127,255,0.2)]" 
          : "border-t-teal/50 shadow-[0_-1px_10px_-4px_rgba(46,232,181,0.2)]"
      )}>
        <div className="flex items-center justify-between mb-3">
          <div className="h-3 w-20 bg-white/5 rounded" />
          <div className="p-2 rounded-lg bg-white/5 border border-white/5 w-8 h-8" />
        </div>
        <div className="flex items-baseline gap-2">
          <div className="h-8 w-24 bg-white/5 rounded" />
          <div className="h-4 w-10 bg-white/5 rounded" />
        </div>
      </div>
    );
  }

  const maskValue = (val: string | number) => {
    return val;
  };

  const colorClasses = {
    accent: "border-t-accent shadow-[0_-1px_10px_-4px_rgba(108,127,255,0.5)]",
    teal: "border-t-teal shadow-[0_-1px_10px_-4px_rgba(46,232,181,0.5)]",
  };

  return (
    <div className={cn(
      "relative overflow-hidden rounded-xl bg-card border border-border p-4 sm:p-5 transition-all hover:border-border/40 min-w-0",
      "border-t-2",
      colorClasses[accentColor]
    )}>
      {/* Background Icon */}
      <div className="absolute -right-3 -bottom-3 text-foreground/[0.03]" aria-hidden="true">
        <Icon size={72} strokeWidth={1} />
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-heading font-bold uppercase tracking-widest text-foreground/50">
            {label}
          </span>
          <div className={cn(
            "p-2 rounded-lg bg-white/[0.03] border border-white/[0.05]",
            accentColor === "accent" ? "text-accent" : "text-teal"
          )}>
            <Icon size={16} />
          </div>
        </div>

        <div className="flex items-baseline gap-2">
          <h3 className="text-xl sm:text-2xl font-heading font-bold text-foreground truncate">
            {maskValue(value)}
          </h3>
          {trend && (
            <span className={cn(
              "text-xs font-medium px-1.5 py-0.5 rounded-md",
              trend.isPositive ? "bg-teal/10 text-teal" : "text-foreground/40 bg-white/5"
            )}>
              {trend.isPositive ? "+" : ""}{trend.value}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

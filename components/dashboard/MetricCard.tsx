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
}

export const MetricCard = ({
  label,
  value,
  icon: Icon,
  trend,
  accentColor = "accent",
}: MetricCardProps) => {
  const { isPrivacyEnabled, hasHydrated } = usePrivacy();

  const maskValue = (val: string | number) => {
    if (!isPrivacyEnabled || !hasHydrated) return val;
    
    const strVal = String(val);
    // Common pattern for UPI/Finance: ₹1,234.56 or 1234
    // Mask digits but keep currency symbols and dots/commas if possible, 
    // or just return a standard masked string.
    return strVal.replace(/\d/g, "*");
  };

  const colorClasses = {
    accent: "border-t-accent shadow-[0_-1px_10px_-4px_rgba(108,127,255,0.5)]",
    teal: "border-t-teal shadow-[0_-1px_10px_-4px_rgba(46,232,181,0.5)]",
  };

  return (
    <div className={cn(
      "relative overflow-hidden rounded-xl bg-card border border-border p-5 transition-all hover:border-border/40",
      "border-t-2",
      colorClasses[accentColor]
    )}>
      {/* Background Icon */}
      <div className="absolute -right-2 -bottom-2 text-foreground/[0.03]" aria-hidden="true">
        <Icon size={100} strokeWidth={1} />
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
          <h3 className="text-2xl font-heading font-bold text-foreground">
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

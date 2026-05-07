"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface SpendingData {
  month: string;
  historical: number | null;
  projected: number | null;
}

interface SpendingChartProps {
  data?: SpendingData[];
  loading?: boolean;
}

export const SpendingChart = ({ data = [], loading = false }: SpendingChartProps) => {
  if (loading) {
    return (
      <div className="bg-card border border-border p-6 rounded-2xl h-[400px] animate-pulse">
        <div className="h-6 w-1/3 bg-white/5 rounded mb-6" />
        <div className="flex-1 bg-white/5 rounded" />
      </div>
    );
  }

  return (
    <div className="bg-card border border-border p-6 rounded-2xl h-[400px] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-heading font-bold text-lg text-foreground leading-tight">Spending Velocity</h3>
          <p className="text-[10px] font-heading font-bold text-foreground/30 uppercase tracking-[0.2em] mt-1">Historical vs Projected</p>
        </div>
        <div className="p-2.5 bg-accent/10 text-accent rounded-xl border border-accent/20">
          <TrendingUp size={20} />
        </div>
      </div>

      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorProjected" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-accent)" stopOpacity={0.08} />
                <stop offset="95%" stopColor="var(--color-accent)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorHistorical" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-teal)" stopOpacity={0.04} />
                <stop offset="95%" stopColor="var(--color-teal)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
            <XAxis 
              dataKey="month" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11, fontWeight: 500, fontFamily: 'var(--font-dm-sans)' }}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11, fontWeight: 500, fontFamily: 'var(--font-dm-sans)' }}
              tickFormatter={(value) => `₹${value / 1000}k`}
            />
            <Tooltip 
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-[#181c27] border border-white/10 p-3 rounded-xl shadow-xl backdrop-blur-md">
                      <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2 font-heading">{label}</p>
                      {payload.map((entry, index) => (
                        <div key={index} className="flex items-center gap-2 mb-1 last:mb-0">
                          <div 
                            className="w-1.5 h-1.5 rounded-full" 
                            style={{ backgroundColor: entry.color }} 
                          />
                          <span className="text-xs font-medium text-white/70 font-sans">{entry.name}:</span>
                          <span className="text-xs font-bold text-white font-sans">₹{entry.value?.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend 
              verticalAlign="top" 
              align="right" 
              iconType="circle"
              iconSize={8}
              content={({ payload }) => (
                <div className="flex gap-4 mb-4 justify-end">
                  {payload?.map((entry, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div 
                        className={cn(
                          "w-2 h-2 rounded-full",
                          entry.value === "Projected" ? "bg-accent" : "bg-teal"
                        )} 
                      />
                      <span className="text-[10px] text-foreground/40 font-heading font-bold uppercase tracking-wider">
                        {entry.value}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            />
            <Area
              type="monotone"
              dataKey="projected"
              name="Projected"
              stroke="var(--color-accent)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorProjected)"
              activeDot={{ r: 4, strokeWidth: 0, fill: "var(--color-accent)" }}
            />
            <Area
              type="monotone"
              dataKey="historical"
              name="Historical"
              stroke="var(--color-teal)"
              strokeWidth={2}
              strokeDasharray="5 5"
              fillOpacity={1}
              fill="url(#colorHistorical)"
              activeDot={{ r: 4, strokeWidth: 0, fill: "var(--color-teal)" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

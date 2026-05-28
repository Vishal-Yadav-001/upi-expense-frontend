"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface MonthlySpendChartProps {
  data: { month: string; total: number }[];
  loading?: boolean;
}

export const MonthlySpendChart = ({ data, loading }: MonthlySpendChartProps) => {
  if (loading) {
    return <div className="bg-card border border-border p-6 rounded-2xl h-[400px] animate-pulse" />;
  }

  return (
    <div className="bg-card border border-border p-6 rounded-2xl h-[400px] min-h-[400px]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-bold text-lg">Spending Velocity</h3>
          <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-[0.2em]">6-Month Trend</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full" />
            <span className="text-[10px] text-foreground/40 font-bold uppercase tracking-wider">Projected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-primary/40 rounded-full" />
            <span className="text-[10px] text-foreground/40 font-bold uppercase tracking-wider">Historical</span>
          </div>
        </div>
      </div>
      
      <div className="flex-1 h-[300px] min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e1e30" vertical={false} />
          <XAxis 
            dataKey="month" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontFamily: 'var(--font-mono)', fontSize: 10, fill: 'var(--color-muted-foreground)' }} 
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontFamily: 'var(--font-mono)', fontSize: 10, fill: 'var(--color-muted-foreground)' }}
          />
          <Tooltip 
            cursor={{ fill: "rgba(129, 140, 248, 0.05)" }}
            contentStyle={{ 
              backgroundColor: "#13131f", 
              border: "1px solid #1e1e30", 
              borderRadius: "12px",
              fontSize: "12px",
              fontFamily: "var(--font-jetbrains-mono)"
            }}
            itemStyle={{ color: "#818cf8" }}
            labelStyle={{ color: "#94a3b8", marginBottom: "4px", fontWeight: "bold" }}
          />
          <Bar dataKey="total" radius={[4, 4, 0, 0]} barSize={32}>
            {data.map((_, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill="#818cf8" 
                fillOpacity={index === data.length - 1 ? 1 : 0.4}
              />
            ))}
          </Bar>
        </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

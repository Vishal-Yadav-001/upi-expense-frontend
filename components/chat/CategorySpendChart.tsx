"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface CategorySpendChartProps {
  data: { category: string; total: number }[];
  loading?: boolean;
}

const COLORS = [
  "#818cf8", // Indigo (Primary)
  "#10b981", // Emerald
  "#f59e0b", // Amber
  "#ef4444", // Red
  "#8b5cf6", // Violet
  "#ec4899", // Pink
  "#06b6d4", // Cyan
  "#f97316", // Orange
  "#64748b", // Slate
];

export const CategorySpendChart = ({ data, loading }: CategorySpendChartProps) => {
  if (loading) {
    return <div className="bg-card border border-border p-6 rounded-2xl h-[300px] animate-pulse" />;
  }

  // Handle empty or zero data
  if (!data || data.length === 0) {
    return (
      <div className="bg-card border border-border p-6 rounded-2xl h-[300px] flex items-center justify-center">
        <p className="text-xs text-foreground/30 italic">No category data available for this period.</p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border p-6 rounded-2xl h-[350px] mt-4 overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-sm uppercase tracking-wider">Category Breakdown</h3>
          <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-[0.2em]">Spend Analysis</p>
        </div>
      </div>
      
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="total"
              nameKey="category"
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]} 
                  stroke="rgba(0,0,0,0.1)"
                />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "#13131f", 
                border: "1px solid #1e1e30", 
                borderRadius: "12px",
                fontSize: "12px",
                fontFamily: "var(--font-jetbrains-mono)",
                color: "#fff"
              }}
              itemStyle={{ color: "#818cf8" }}
              formatter={(value: any) => `₹${Number(value || 0).toLocaleString()}`}
            />
            <Legend 
              verticalAlign="bottom" 
              align="center"
              iconType="circle"
              wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

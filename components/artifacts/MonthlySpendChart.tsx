"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const data = [
  { month: "Jan", amount: 4500 },
  { month: "Feb", amount: 5200 },
  { month: "Mar", amount: 4800 },
  { month: "Apr", amount: 6100 },
  { month: "May", amount: 5500 },
  { month: "Jun", amount: 6700 },
];

export const MonthlySpendChart = () => {
  return (
    <div className="bg-card border border-border p-6 rounded-2xl h-[400px]">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-lg">Monthly Spending</h3>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-primary rounded-full" />
          <span className="text-xs text-foreground/50 font-medium">Actual Spend</span>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e1e30" vertical={false} />
          <XAxis 
            dataKey="month" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: "#94a3b8", fontSize: 12 }} 
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: "#94a3b8", fontSize: 12 }}
          />
          <Tooltip 
            cursor={{ fill: "rgba(129, 140, 248, 0.05)" }}
            contentStyle={{ 
              backgroundColor: "#13131f", 
              border: "1px solid #1e1e30", 
              borderRadius: "12px",
              fontSize: "12px"
            }}
          />
          <Bar dataKey="amount" radius={[6, 6, 0, 0]} barSize={40}>
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={index === data.length - 1 ? "#818cf8" : "#818cf8"} 
                fillOpacity={index === data.length - 1 ? 1 : 0.4}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

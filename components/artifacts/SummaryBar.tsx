import { Wallet, PiggyBank, Calendar } from "lucide-react";

export const SummaryBar = () => {
  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <div className="bg-card border border-border p-4 rounded-2xl">
        <div className="flex items-center gap-2 text-foreground/50 mb-1">
          <Wallet size={16} />
          <span className="text-xs font-medium uppercase tracking-wider">Total Spend</span>
        </div>
        <div className="text-2xl font-bold">₹12,450</div>
      </div>

      <div className="bg-card border border-border p-4 rounded-2xl">
        <div className="flex items-center gap-2 text-foreground/50 mb-1">
          <PiggyBank size={16} />
          <span className="text-xs font-medium uppercase tracking-wider">Budget Status</span>
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="text-2xl font-bold">62%</div>
          <div className="w-full h-1.5 bg-background rounded-full overflow-hidden">
            <div className="h-full bg-primary w-[62%] rounded-full" />
          </div>
        </div>
      </div>

      <div className="bg-card border border-border p-4 rounded-2xl">
        <div className="flex items-center gap-2 text-foreground/50 mb-1">
          <Calendar size={16} />
          <span className="text-xs font-medium uppercase tracking-wider">Upcoming</span>
        </div>
        <div className="text-2xl font-bold">3 <span className="text-sm font-normal text-foreground/50 ml-1">Bills</span></div>
      </div>
    </div>
  );
};

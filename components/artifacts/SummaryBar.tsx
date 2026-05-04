import { Wallet, ShieldCheck, Zap, Loader2 } from "lucide-react";

interface SummaryBarProps {
  totalSpend: number;
  upcomingCount: number;
  activeMandates: number;
  loading?: boolean;
}

export const SummaryBar = ({ totalSpend, upcomingCount, activeMandates, loading }: SummaryBarProps) => {
  const displayAmount = `₹${totalSpend.toLocaleString()}`;

  const isHighSpend = totalSpend > 30000;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {/* Monthly Spend - Bento Item 1 */}
      <div className={`bg-card border ${isHighSpend ? 'border-destructive/30' : 'border-border'} p-6 rounded-[14px] flex flex-col justify-between relative overflow-hidden group transition-all hover:border-primary/30`}>
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40">Monthly Spend</span>
          <Wallet size={14} className="text-foreground/20" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className={`text-2xl font-mono font-bold tracking-tighter ${isHighSpend ? 'text-destructive' : 'text-foreground'}`}>
            {loading ? <Loader2 size={20} className="animate-spin text-primary" /> : displayAmount}
          </span>
          {isHighSpend && !loading && (
            <span className="text-[10px] font-bold text-destructive/60 bg-destructive/10 px-1.5 py-0.5 rounded uppercase tracking-wider">High</span>
          )}
        </div>
      </div>

      {/* Active Mandates - Bento Item 2 */}
      <div className="bg-card border border-border p-6 rounded-[14px] flex flex-col justify-between relative overflow-hidden group transition-all hover:border-primary/30">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40">Active Mandates</span>
          <ShieldCheck size={14} className="text-foreground/20" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-mono font-bold tracking-tighter text-foreground">
            {loading ? <Loader2 size={20} className="animate-spin text-primary" /> : activeMandates}
          </span>
          <span className="text-[10px] font-bold text-primary/60 uppercase tracking-wider">Secured</span>
        </div>
      </div>

      {/* Due Tomorrow - Bento Item 3 */}
      <div className="bg-card border border-border p-6 rounded-[14px] flex flex-col justify-between relative overflow-hidden group transition-all hover:border-primary/30">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40">Due Tomorrow</span>
          <Zap size={14} className="text-foreground/20" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-mono font-bold tracking-tighter text-secondary">
            {loading ? <Loader2 size={20} className="animate-spin text-primary" /> : upcomingCount}
          </span>
          <span className="text-[10px] font-bold text-secondary/60 uppercase tracking-wider">Bills</span>
        </div>
      </div>
    </div>
  );
};

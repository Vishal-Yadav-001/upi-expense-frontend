"use client";

import { useState } from "react";
import { Message } from "@/hooks/useChat";
import { motion } from "framer-motion";
import { User, Bot, Pin, Copy, Check } from "lucide-react";
import { clsx } from "clsx";
import { usePrivacy } from "@/context/PrivacyContext";
import { usePinnedInsights, PinnedChartType } from "@/context/PinnedInsightsContext";
import dynamic from "next/dynamic";

const MonthlySpendChart = dynamic(() => import("./MonthlySpendChart").then(mod => mod.MonthlySpendChart), { ssr: false });
const CategorySpendChart = dynamic(() => import("./CategorySpendChart").then(mod => mod.CategorySpendChart), { ssr: false });

const PinButton = ({ type, label, data }: { type: PinnedChartType; label: string; data: any[] }) => {
  const { pinInsight, unpinInsight, pinnedInsights, isDataPinned } = usePinnedInsights();
  const pinned = isDataPinned(type, data);

  const handleToggle = () => {
    if (pinned) {
      const match = pinnedInsights.find(
        (p) => p.type === type && JSON.stringify(p.data) === JSON.stringify(data)
      );
      if (match) unpinInsight(match.id);
    } else {
      pinInsight(type, label, data);
    }
  };

  return (
    <button
      onClick={handleToggle}
      title={pinned ? "Unpin from Dashboard" : "Pin to Dashboard"}
      className={clsx(
        "absolute top-3 right-3 z-10 p-1.5 rounded-lg border transition-all cursor-pointer",
        pinned
          ? "bg-accent/20 border-accent/40 text-accent"
          : "bg-card/80 border-border text-foreground/30 hover:text-accent hover:border-accent/30"
      )}
    >
      <Pin size={14} className={clsx(pinned && "fill-accent")} />
    </button>
  );
};

const CopyButton = ({ text, isUser }: { text: string; isUser: boolean }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className={clsx(
        "flex items-center gap-1 text-[10px] transition-opacity duration-200 opacity-0 group-hover:opacity-100 cursor-pointer mt-1 px-1",
        isUser ? "text-primary/60 hover:text-primary self-end" : "text-foreground/40 hover:text-foreground/80 self-start"
      )}
    >
      {copied ? <Check size={12} /> : <Copy size={12} />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
};

export const ChatMessage = ({ message }: { message: Message }) => {
  const isUser = message.role === "user";
  const { isPrivacyEnabled } = usePrivacy();

  const content = isPrivacyEnabled 
    ? message.content.replace(/₹\d+(?:,\d+)*(?:\.\d+)?/g, "₹****")
    : message.content;

  // Extract artifact data
  const monthlyData = message.data?.get_monthly_spend as any[];
  const categoryData = message.data?.get_spend_by_category as any[];
  const summaryData = message.data?.get_financial_summary as any[];

  // Map financial summaries to velocity chart format if needed
  // We use reverse() because the backend returns them sorted by period DESC
  const velocityData = summaryData ? [...summaryData].map(s => ({
    month: s.period,
    total: s.totalDebit
  })).reverse() : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={clsx(
        "flex gap-3 mb-6",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      <div
        className={clsx(
          "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
          isUser ? "bg-primary text-background" : "bg-card border border-border text-primary"
        )}
      >
        {isUser ? <User size={18} /> : <Bot size={18} />}
      </div>
      <div className={clsx("flex flex-col max-w-[85%] min-w-0 group", isUser ? "items-end" : "items-start")}>
        <div
          className={clsx(
            "px-4 py-2.5 text-sm leading-relaxed font-sans shadow-sm whitespace-pre-wrap break-words w-fit overflow-hidden",
            isUser
              ? "bg-primary text-primary-foreground rounded-2xl rounded-tr-none"
              : "bg-card border border-border text-foreground rounded-2xl rounded-tl-none"
          )}
        >
          {content.split(/(`[^`]+`)/g).map((part, i) => (
            part.startsWith("`") && part.endsWith("`") ? (
              <code key={i} className="font-mono bg-black/20 px-1.5 py-0.5 rounded text-xs">
                {part.slice(1, -1)}
              </code>
            ) : (
              part
            )
          ))}
        </div>
        
        <CopyButton text={message.content} isUser={isUser} />

        {/* AI Artifacts with Pin buttons */}
        {!isUser && message.data && (
          <div className="w-full mt-1 min-w-0 overflow-hidden space-y-3">
            {monthlyData && (
              <div className="relative">
                <PinButton type="monthly_spend" label="Monthly Spend" data={monthlyData} />
                <MonthlySpendChart data={monthlyData} />
              </div>
            )}
            {velocityData && (
              <div className="relative">
                <PinButton type="velocity" label="Spending Velocity" data={velocityData} />
                <MonthlySpendChart data={velocityData} />
              </div>
            )}
            {categoryData && (
              <div className="relative">
                <PinButton type="category_spend" label="Category Breakdown" data={categoryData} />
                <CategorySpendChart data={categoryData} />
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

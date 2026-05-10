"use client";

import React from "react";
import { Bell, RefreshCw, Search, Sparkles, Loader2 } from "lucide-react";
import { useUI } from "@/context/UIContext";
import { usePathname } from "next/navigation";
import { useSync } from "@/hooks/useSync";
import { cn } from "@/lib/utils";

export function Topbar() {
  const { toggleChat } = useUI();
  const pathname = usePathname();
  const { sync, isSyncing } = useSync();

  const handleAskAI = () => {
    // Only toggle chat if on dashboard (root path)
    if (pathname === "/" || pathname === "" || pathname === null) {
      toggleChat();
    }
  };

  return (
    <header className="h-16 border-b border-border bg-panel/50 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-10">
      <div className="flex flex-col">
        <h1 className="text-lg font-bold text-white tracking-tight font-heading">Command Center</h1>
        <p className="text-xs text-zinc-500 font-medium font-sans">Autonomous Financial Engine</p>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-teal/10 border border-teal/20">
          <div className="w-2 h-2 rounded-full bg-teal animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-teal font-sans">System Online</span>
        </div>

        <div className="flex items-center gap-2">
          <button 
            className="p-2 text-zinc-400 hover:text-white transition-colors rounded-md hover:bg-white/5"
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </button>
          <button 
            className="p-2 text-zinc-400 hover:text-white transition-colors rounded-md hover:bg-white/5"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
          </button>
          <button 
            onClick={sync}
            disabled={isSyncing}
            className={cn(
              "p-2 transition-colors rounded-md",
              isSyncing ? "text-teal animate-spin" : "text-zinc-400 hover:text-white hover:bg-white/5"
            )}
            title="Sync AI & Analytics"
            aria-label="Sync AI & Analytics"
          >
            {isSyncing ? <Loader2 className="w-4 h-4" /> : <RefreshCw className="w-4 h-4" />}
          </button>
        </div>

        <button 
          onClick={handleAskAI}
          className="flex items-center gap-2 px-4 py-1.5 bg-accent hover:bg-accent/90 text-white rounded-md text-sm font-bold transition-all shadow-lg shadow-accent/20 font-sans"
        >
          <Sparkles className="w-4 h-4" />
          <span>Ask AI</span>
        </button>
      </div>
    </header>
  );
}

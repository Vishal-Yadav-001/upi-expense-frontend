"use client";

import React from "react";
import { Bell, RefreshCw, Search, Sparkles } from "lucide-react";

export function Topbar() {
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
            className="p-2 text-zinc-400 hover:text-white transition-colors rounded-md hover:bg-white/5"
            aria-label="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        <button className="flex items-center gap-2 px-4 py-1.5 bg-accent hover:bg-accent/90 text-white rounded-md text-sm font-bold transition-all shadow-lg shadow-accent/20 font-sans">
          <Sparkles className="w-4 h-4" />
          <span>Ask AI</span>
        </button>
      </div>
    </header>
  );
}

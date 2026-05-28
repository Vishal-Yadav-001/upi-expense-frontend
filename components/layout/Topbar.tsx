"use client";

import React from "react";
import { Bell, Search, Sparkles } from "lucide-react";
import { useUI } from "@/context/UIContext";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function Topbar() {
  const { toggleChat } = useUI();
  const pathname = usePathname();

  const handleAskAI = () => {
    // Only toggle chat if on dashboard (root path)
    if (pathname === "/" || pathname === "" || pathname === null) {
      toggleChat();
    }
  };

  const getPageTitle = () => {
    switch (pathname) {
      case "/":
        return "Dashboard";
      case "/transactions":
        return "Transaction Ledger";
      case "/bills":
        return "Subscriptions & Bills";
      case "/analytics":
        return "Analytics Engine";
      case "/settings":
        return "Control Panel";
      case "/feedback":
        return "Developer Feedback";
      case "/imports":
        return "Import History";
      default:
        return "Command Center";
    }
  };

  const pageTitle = getPageTitle();

  return (
    <header className="h-16 border-b border-border/30 bg-card/10 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-20">
      {/* Dynamic Route Breadcrumb Tracker */}
      <div className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-widest font-sans">
        <span className="text-foreground/30 font-medium">UPI Sense</span>
        <span className="text-foreground/20 font-bold">/</span>
        <motion.span 
          key={pathname}
          initial={{ opacity: 0, x: -3 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
          className="text-accent"
        >
          {pageTitle}
        </motion.span>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-6">
        {/* Neon Status Beacon */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-soft/10 border border-teal/20 shadow-[0_0_10px_rgba(46,232,181,0.06)] shrink-0">
          <div className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse" />
          <span className="text-[9px] font-extrabold uppercase tracking-widest text-teal font-sans">
            System Online
          </span>
        </div>

        {/* Micro-Interaction Action Icons */}
        <div className="flex items-center gap-0.5 bg-white/5 border border-border/40 p-0.5 rounded-xl">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 text-foreground/40 hover:text-white transition-colors rounded-lg hover:bg-white/5 cursor-pointer outline-none"
            aria-label="Search"
          >
            <Search className="w-3.5 h-3.5" />
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 text-foreground/40 hover:text-white transition-colors rounded-lg hover:bg-white/5 cursor-pointer outline-none"
            aria-label="Notifications"
          >
            <Bell className="w-3.5 h-3.5" />
          </motion.button>
        </div>

        {/* Bouncy Capsule Ask AI Button */}
        <motion.button 
          whileHover={{ scale: 1.02, boxShadow: "0 0 15px rgba(108, 127, 255, 0.25)" }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAskAI}
          className={cn(
            "flex items-center gap-1.5 px-4 py-1.5 bg-accent hover:bg-accent/95 text-background font-extrabold rounded-xl text-[10px] uppercase tracking-wider transition-all font-sans cursor-pointer shadow-lg shadow-accent/10 border border-accent/25 outline-none",
            pathname !== "/" && "opacity-40 cursor-not-allowed pointer-events-none border-border/30 bg-white/5 text-foreground/30 shadow-none"
          )}
          title={pathname === "/" ? "Consult Gemini Assistant" : "Gemini assistant active on dashboard only"}
        >
          <Sparkles className="w-3 h-3" />
          <span>Ask AI</span>
        </motion.button>
      </div>
    </header>
  );
}

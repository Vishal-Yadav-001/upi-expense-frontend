"use client";

import React from "react";
import { Sparkles, Menu } from "lucide-react";
import { SignInButton, UserButton, Show } from "@clerk/nextjs";
import { useUI } from "@/context/UIContext";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function Topbar() {
  const { toggleChat, toggleMobileSidebar } = useUI();
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
    <header className="h-16 border-b border-border/30 bg-card/10 backdrop-blur-md flex items-center justify-between px-4 sm:px-6 md:px-8 sticky top-0 z-20">
      {/* Left side actions (Hamburger + Dynamic Route Tracker) */}
      <div className="flex items-center gap-3">
        {/* Hamburger Menu Toggle Button for Tablet/Mobile viewports */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleMobileSidebar}
          className="lg:hidden p-2 rounded-xl bg-white/5 border border-border/60 hover:bg-white/10 hover:border-accent/40 text-foreground/70 hover:text-white transition-all cursor-pointer outline-none"
          title="Toggle Navigation Menu"
        >
          <Menu className="w-4 h-4" />
        </motion.button>

        {/* Dynamic Route Breadcrumb Tracker */}
        <div className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-widest font-sans">
          <span className="text-foreground/30 font-medium hidden xs:inline-block">UPI Sense</span>
          <span className="text-foreground/20 font-bold hidden xs:inline-block">/</span>
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
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-3 sm:gap-6">
        {/* Neon Status Beacon */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-soft/10 border border-teal/20 shadow-[0_0_10px_rgba(34,197,94,0.06)] shrink-0">
          <div className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse" />
          <span className="text-[9px] font-extrabold uppercase tracking-widest text-teal font-sans hidden sm:inline-block">
            System Online
          </span>
        </div>

        {/* Bouncy Capsule Ask AI Button */}
        <motion.button 
          whileHover={{ scale: 1.02, boxShadow: "0 0 15px rgba(37, 99, 235, 0.25)" }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAskAI}
          className={cn(
            "flex items-center gap-1.5 px-4 py-1.5 bg-accent hover:bg-accent/95 text-white font-extrabold rounded-xl text-[10px] uppercase tracking-wider transition-all font-sans cursor-pointer shadow-lg shadow-accent/10 border border-accent/25 outline-none shrink-0",
            pathname !== "/" && "opacity-40 cursor-not-allowed pointer-events-none border-border/30 bg-white/5 text-foreground/30 shadow-none"
          )}
          title={pathname === "/" ? "Consult Gemini Assistant" : "Gemini assistant active on dashboard only"}
        >
          <Sparkles className="w-3 h-3" />
          <span>Ask AI</span>
        </motion.button>

        <div className="h-4 w-px bg-border/40 mx-1 hidden sm:block" />
        
        {/* Clerk Authentication */}
        <Show when="signed-in">
          <div className="flex items-center hover:scale-105 transition-transform">
            <UserButton afterSignOutUrl="/" appearance={{
              elements: {
                userButtonAvatarBox: "w-8 h-8 rounded-xl border border-white/10 shadow-lg shadow-black/20"
              }
            }} />
          </div>
        </Show>
        <Show when="signed-out">
          <SignInButton mode="modal">
            <button className="px-4 py-1.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-[10px] uppercase tracking-wider transition-all font-sans cursor-pointer border border-white/5 outline-none shrink-0 shadow-md">
              Sign In
            </button>
          </SignInButton>
        </Show>
      </div>
    </header>
  );
}


"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Receipt, 
  BarChart3, 
  Upload, 
  CreditCard, 
  MessageSquare, 
  Settings,
  BrainCircuit,
  Shield,
  ShieldOff
} from "lucide-react";
import { cn } from "@/lib/utils";
import { usePrivacy } from "@/context/PrivacyContext";
import { motion } from "framer-motion";

const navigation = [
  {
    title: "Overview",
    items: [
      { name: "Dashboard", href: "/", icon: LayoutDashboard },
      { name: "Transactions", href: "/transactions", icon: Receipt },
      { name: "Analytics", href: "/analytics", icon: BarChart3 },
    ],
  },
  {
    title: "Management",
    items: [
      { name: "Import History", href: "/imports", icon: Upload },
      { name: "Subscriptions & Bills", href: "/bills", icon: CreditCard },
    ],
  },
  {
    title: "Account",
    items: [
      { name: "Feedback", href: "/feedback", icon: MessageSquare },
      { name: "Settings", href: "/settings", icon: Settings },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { isPrivacyEnabled, togglePrivacy } = usePrivacy();
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div className="h-full bg-panel border-r border-border/50 w-64 flex-shrink-0" />;
  }

  return (
    <div className="flex flex-col h-full bg-card/10 border-r border-border/40 w-64 flex-shrink-0 relative z-30 backdrop-blur-xl shadow-2xl">
      {/* Dynamic Branding Header */}
      <div className="p-6 border-b border-border/30 bg-panel/10">
        <Link href="/" className="flex items-center gap-2.5 text-white font-heading relative group">
          <div className="relative shrink-0">
            {/* Brand Logo Mesh Ambient Glow */}
            <div className="absolute inset-0 bg-accent/20 rounded-xl blur-md opacity-60 group-hover:opacity-100 transition-opacity" />
            <div className="p-2 bg-accent/15 border border-accent/20 rounded-xl relative z-10 text-accent group-hover:border-accent/40 transition-colors">
              <BrainCircuit className="w-5 h-5 animate-pulse text-accent" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-extrabold tracking-tight text-white font-heading group-hover:text-accent transition-colors">
              UPI Sense
            </span>
            <span className="text-[8px] uppercase tracking-[0.25em] text-accent font-sans font-bold -mt-0.5">
              RAG Engine
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation list */}
      <nav className="flex-1 px-4 space-y-7 mt-6 overflow-y-auto custom-scrollbar">
        {navigation.map((section) => (
          <div key={section.title} className="space-y-2">
            <h3 className="px-3 text-[9px] font-bold text-foreground/30 uppercase tracking-[0.2em] font-heading">
              {section.title}
            </h3>
            <div className="space-y-1">
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <motion.div
                    key={item.name}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all font-sans group relative overflow-hidden",
                        isActive 
                          ? "bg-accent/10 text-white shadow-sm border border-accent/15" 
                          : "text-foreground/50 hover:text-white hover:bg-white/[0.01] hover:border-transparent border border-transparent"
                      )}
                    >
                      {/* Active Indicator Left Bar */}
                      <div className={cn(
                        "absolute left-0 top-1/2 -translate-y-1/2 w-0.75 h-5 rounded-full bg-accent transition-all",
                        isActive ? "opacity-100" : "opacity-0 group-hover:opacity-40"
                      )} />

                      <item.icon className={cn(
                        "w-4 h-4 transition-colors shrink-0", 
                        isActive ? "text-accent" : "text-foreground/30 group-hover:text-foreground/60"
                      )} />
                      <span>{item.name}</span>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Privacy toggle container footer */}
      <div className="p-4 border-t border-border/30 bg-panel/10">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={togglePrivacy}
          aria-pressed={isPrivacyEnabled}
          className={cn(
            "flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all font-sans group border cursor-pointer outline-none",
            isPrivacyEnabled 
              ? "bg-accent/10 text-accent border-accent/30 shadow-lg shadow-accent/5" 
              : "bg-white/5 text-foreground/50 border-border/50 hover:bg-white/10 hover:border-border/80"
          )}
        >
          <div className="flex items-center gap-2">
            {isPrivacyEnabled ? (
              <Shield className="w-4 h-4 text-accent animate-pulse shrink-0" />
            ) : (
              <ShieldOff className="w-4 h-4 text-foreground/30 shrink-0" />
            )}
            <span>Privacy Scrubber</span>
          </div>
          
          <div className={cn(
            "w-7 h-4 rounded-full relative transition-colors shrink-0",
            isPrivacyEnabled ? "bg-accent" : "bg-white/10"
          )}>
            <motion.div 
              layout
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="absolute top-0.5 w-3 h-3 rounded-full bg-white shadow-sm"
              style={{ left: isPrivacyEnabled ? "14px" : "2px" }}
            />
          </div>
        </motion.button>
      </div>
    </div>
  );
}

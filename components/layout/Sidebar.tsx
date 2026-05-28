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
  Key, 
  MessageSquare, 
  Settings,
  BrainCircuit,
  Shield,
  ShieldOff
} from "lucide-react";
import { cn } from "@/lib/utils";
import { usePrivacy } from "@/context/PrivacyContext";

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
    return <div className="h-full bg-panel border-r border-border w-64 flex-shrink-0" />;
  }

  return (
    <div className="flex flex-col h-full bg-panel border-r border-border w-64 flex-shrink-0 relative z-30">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2 text-white font-heading">
          <BrainCircuit className="w-8 h-8 text-accent" />
          <span className="text-xl font-bold tracking-tight text-white">UPI Sense</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-8 mt-4 overflow-y-auto">
        {navigation.map((section) => (
          <div key={section.title}>
            <h3 className="px-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 font-heading">
              {section.title}
            </h3>
            <div className="space-y-1">
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all font-sans group",
                      isActive 
                        ? "bg-accent/10 text-white shadow-sm" 
                        : "text-zinc-400 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <item.icon className={cn("w-4 h-4 transition-colors", isActive ? "text-accent" : "text-zinc-500 group-hover:text-zinc-300")} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-border bg-panel">
        <button
          onClick={togglePrivacy}
          aria-pressed={isPrivacyEnabled}
          className={cn(
            "flex items-center justify-between w-full px-3 py-2 rounded-xl text-sm font-medium transition-all font-sans group",
            isPrivacyEnabled 
              ? "bg-accent/10 text-accent border border-accent/20 shadow-lg shadow-accent/5" 
              : "bg-white/5 text-zinc-400 border border-border hover:bg-white/10"
          )}
        >
          <div className="flex items-center gap-2">
            {isPrivacyEnabled ? <Shield className="w-4 h-4" /> : <ShieldOff className="w-4 h-4" />}
            <span>Privacy Mode</span>
          </div>
          <div className={cn(
            "w-8 h-4 rounded-full relative transition-colors",
            isPrivacyEnabled ? "bg-accent" : "bg-zinc-700"
          )}>
            <div className={cn(
              "absolute top-1 w-2 h-2 rounded-full bg-white transition-all",
              isPrivacyEnabled ? "left-5" : "left-1"
            )} />
          </div>
        </button>
      </div>
    </div>
  );
}

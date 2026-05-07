"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Receipt, 
  BarChart3, 
  Upload, 
  FileText, 
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
    title: "Tools",
    items: [
      { name: "Upload Statement", href: "/upload", icon: Upload },
      { name: "Mandates", href: "/mandates", icon: FileText },
      { name: "Bills", href: "/bills", icon: CreditCard },
    ],
  },
  {
    title: "Account",
    items: [
      { name: "AI Key", href: "/ai-key", icon: Key },
      { name: "Feedback", href: "/feedback", icon: MessageSquare },
      { name: "Settings", href: "/settings", icon: Settings },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { isPrivacyEnabled, togglePrivacy } = usePrivacy();

  return (
    <div className="flex flex-col h-full bg-zinc-950 border-r border-zinc-800 w-64">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2 text-white">
          <BrainCircuit className="w-8 h-8 text-blue-500" />
          <span className="text-xl font-bold tracking-tight">BrainCircuit</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-8 mt-4">
        {navigation.map((section) => (
          <div key={section.title}>
            <h3 className="px-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
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
                      "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      isActive 
                        ? "bg-zinc-800 text-white" 
                        : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                    )}
                  >
                    <item.icon className={cn("w-4 h-4", isActive ? "text-blue-500" : "text-zinc-500")} />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-zinc-800">
        <button
          onClick={togglePrivacy}
          className={cn(
            "flex items-center justify-between w-full px-3 py-2 rounded-md text-sm font-medium transition-all",
            isPrivacyEnabled 
              ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" 
              : "bg-zinc-900 text-zinc-400 border border-zinc-800"
          )}
        >
          <div className="flex items-center gap-2">
            {isPrivacyEnabled ? <Shield className="w-4 h-4" /> : <ShieldOff className="w-4 h-4" />}
            <span>Privacy Mode</span>
          </div>
          <div className={cn(
            "w-8 h-4 rounded-full relative transition-colors",
            isPrivacyEnabled ? "bg-blue-500" : "bg-zinc-700"
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

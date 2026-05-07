"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { usePathname } from "next/navigation";

interface UIContextType {
  isChatOpen: boolean;
  toggleChat: () => void;
  setChatOpen: (open: boolean) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: ReactNode }) {
  const [isChatOpen, setChatOpen] = useState(false);
  const pathname = usePathname();

  // Automatically close chat when navigating away from dashboard
  useEffect(() => {
    if (pathname !== "/" && isChatOpen) {
      setChatOpen(false);
    }
  }, [pathname, isChatOpen]);

  const toggleChat = () => setChatOpen((prev) => !prev);

  return (
    <UIContext.Provider value={{ isChatOpen, toggleChat, setChatOpen }}>
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error("useUI must be used within a UIProvider");
  }
  return context;
}

"use client";

import { useState, useEffect } from "react";
import { Settings, MessageSquare } from "lucide-react";
import { SettingsModal } from "./SettingsModal";
import { FeedbackModal } from "./FeedbackModal";
import { usePrivacy } from "@/context/PrivacyContext";

export const Header = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const { isPrivacyEnabled } = usePrivacy();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="w-full sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border flex justify-between items-center px-6 h-16 max-w-full">

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 mr-4">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-bold text-primary-foreground">
            U
          </div>
          <h1 className="text-xl font-bold tracking-tight">UPI Sense</h1>
        </div>

        {mounted && (
          <div className={`px-3 py-1 rounded-full flex items-center gap-2 border transition-colors ${
            isPrivacyEnabled 
              ? "bg-secondary/10 text-secondary border-secondary/20" 
              : "bg-foreground/5 text-foreground/40 border-border"
          }`}>
            <span className={`w-2 h-2 rounded-full ${
              isPrivacyEnabled ? "bg-secondary animate-pulse" : "bg-foreground/20"
            }`}></span>
            <span className="font-bold text-[10px] tracking-widest uppercase">
              Privacy Mode: {isPrivacyEnabled ? "On" : "Off"}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-6">
        <button 
          type="button" 
          onClick={() => setIsFeedbackOpen(true)}
          className="flex items-center gap-2 text-primary/60 hover:text-primary transition-colors cursor-pointer group"
        >
          <MessageSquare className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
          <span className="text-xs font-semibold tracking-wider">FEEDBACK</span>
        </button>

        <div className="w-px h-6 bg-border"></div>

        <div className="flex items-center gap-3">
          <button 
            type="button"
            onClick={() => setIsSettingsOpen(true)}
            className="p-1 text-foreground/30 hover:text-primary transition-colors"
            aria-label="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />

      <FeedbackModal 
        isOpen={isFeedbackOpen} 
        onClose={() => setIsFeedbackOpen(false)} 
      />
    </header>
  );
};

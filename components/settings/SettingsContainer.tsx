"use client";

import React, { useState } from "react";
import { Shield, RefreshCw, Trash2, Loader2, Info } from "lucide-react";
import { usePrivacy } from "@/context/PrivacyContext";
import { SettingsSection } from "./SettingsSection";
import { cn } from "@/lib/utils";

export function SettingsContainer() {
  const { isPrivacyEnabled, togglePrivacy, hasHydrated } = usePrivacy();
  const [isClearing, setIsClearing] = useState(false);

  const handleResetSession = () => {
    if (confirm("This will clear your current chat history and start a fresh session. Continue?")) {
      localStorage.removeItem("upi_session_id");
      window.location.reload();
    }
  };

  const handleClearAllData = async () => {
    if (!confirm("Are you sure you want to clear ALL data, including your privacy settings and session? This cannot be undone.")) {
      return;
    }

    setIsClearing(true);
    try {
      const sessionId = localStorage.getItem("upi_session_id");
      if (sessionId) {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
        const response = await fetch(`${apiUrl}/api/session`, {
          method: "DELETE",
          headers: { "X-Session-ID": sessionId }
        });
        if (!response.ok) throw new Error("Failed to clear server data");
      }
      localStorage.clear();
      window.location.reload();
    } catch (error) {
      console.error("Error clearing data:", error);
      alert("Failed to clear data");
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <SettingsSection 
        title="Privacy & Security" 
        description="Manage how your data is handled during this session."
        icon={Shield}
        iconClassName={isPrivacyEnabled ? "bg-accent/10 text-accent" : "bg-zinc-500/10 text-zinc-500"}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Privacy Mode</p>
            <p className="text-xs text-zinc-500">Mask sensitive names and amounts in the UI.</p>
          </div>
          <button
            onClick={togglePrivacy}
            disabled={!hasHydrated}
            className={cn(
              "w-10 h-5 rounded-full relative transition-colors",
              isPrivacyEnabled ? "bg-accent" : "bg-zinc-700"
            )}
          >
            <div className={cn(
              "absolute top-1 w-3 h-3 bg-white rounded-full transition-all",
              isPrivacyEnabled ? "left-6" : "left-1"
            )} />
          </button>
        </div>
      </SettingsSection>

      <SettingsSection 
        title="Data Management" 
        description="Control your data footprint and session history."
        icon={Trash2}
        iconClassName="bg-destructive/10 text-destructive"
      >
        <div className="space-y-4">
          <button 
            onClick={handleResetSession}
            className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors group"
          >
            <div className="flex items-center gap-3 text-zinc-400 group-hover:text-white transition-colors">
              <RefreshCw size={16} />
              <span className="text-sm font-medium">Start New Session</span>
            </div>
          </button>
          
          <button 
            onClick={handleClearAllData}
            disabled={isClearing}
            className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-destructive/5 transition-colors group"
          >
            <div className="flex items-center gap-3 text-destructive/60 group-hover:text-destructive transition-colors">
              {isClearing ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
              <span className="text-sm font-medium">Clear All Data Permanently</span>
            </div>
          </button>
        </div>
      </SettingsSection>

      <div className="p-4 bg-accent/5 border border-accent/10 rounded-xl flex gap-3">
        <Info size={18} className="text-accent shrink-0" />
        <p className="text-xs text-zinc-400 leading-relaxed">
          Your data is stored locally in your browser and your private MongoDB instance. 
          Clearing data on the server will remove all uploaded statements and processed metadata.
        </p>
      </div>
    </div>
  );
}

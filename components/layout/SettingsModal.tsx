"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, RefreshCw, Trash2, Shield, Info, Loader2 } from "lucide-react";
import { usePrivacy } from "@/context/PrivacyContext";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
  const { isPrivacyEnabled, togglePrivacy } = usePrivacy();
  const [mounted, setMounted] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

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
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const response = await fetch(`${apiUrl}/api/session/clear`, {
          method: "DELETE",
          headers: {
            "X-Session-ID": sessionId
          }
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || "Failed to clear data on server");
        }
      }

      localStorage.clear();
      window.location.reload();
    } catch (error: unknown) {
      console.error("Error clearing data:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      alert(`Failed to clear all data: ${errorMessage}`);
    } finally {
      setIsClearing(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md max-h-[90vh] flex flex-col bg-card border border-border rounded-3xl shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        <div className="flex items-center justify-between px-6 py-5 border-b border-border bg-card/50">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Settings</h2>
            <p className="text-[10px] text-foreground/30 uppercase tracking-widest font-bold mt-0.5">Configuration</p>
          </div>
          <button 
            onClick={onClose}
            aria-label="Close settings"
            className="p-2 hover:bg-foreground/5 rounded-full transition-colors text-foreground/40 hover:text-foreground"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          {/* Privacy Section */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-foreground/40">Privacy & Security</h3>
            <div className="flex items-center justify-between p-4 bg-background/50 border border-border rounded-xl">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${isPrivacyEnabled ? "bg-secondary/10 text-secondary" : "bg-foreground/5 text-foreground/50"}`}>
                  <Shield size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium">PII Masking</p>
                  <p className="text-xs text-foreground/40">Hide sensitive transaction details</p>
                </div>
              </div>
              <button
                onClick={togglePrivacy}
                className={`relative w-10 h-5 rounded-full transition-colors ${isPrivacyEnabled ? "bg-secondary" : "bg-foreground/20"}`}
              >
                <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${isPrivacyEnabled ? "translate-x-5" : ""}`} />
              </button>
            </div>
          </div>

          {/* Data Section */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-foreground/40">Data Management</h3>
            
            <button 
              onClick={handleResetSession}
              className="w-full flex items-center justify-between p-4 bg-background/50 border border-border rounded-xl hover:bg-white/5 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 text-primary rounded-lg">
                  <RefreshCw size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium">New Session</p>
                  <p className="text-xs text-foreground/40">Clear history and start fresh</p>
                </div>
              </div>
            </button>

            <button 
              onClick={handleClearAllData}
              disabled={isClearing}
              className="w-full flex items-center justify-between p-4 bg-destructive/5 border border-destructive/10 rounded-xl hover:bg-destructive/10 transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-destructive/10 text-destructive rounded-lg">
                  {isClearing ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                </div>
                <div>
                  <p className="text-sm font-medium text-destructive">
                    {isClearing ? "Clearing Server Data..." : "Clear All Data"}
                  </p>
                  <p className="text-xs text-destructive/40">Reset everything to defaults</p>
                </div>
              </div>
            </button>
          </div>

          {/* Info Section */}
          <div className="p-4 bg-primary/5 rounded-xl flex gap-3 border border-primary/10">
            <Info size={18} className="text-primary shrink-0" />
            <p className="text-xs text-foreground/60 leading-relaxed">
              Your data stays in your browser and your private MongoDB instance. Resetting the session starts a fresh history, while &apos;Clear All Data&apos; removes everything including processed files on the server.
            </p>
          </div>
        </div>

        <div className="px-6 py-4 bg-card/50 border-t border-border flex justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-primary text-background rounded-lg font-medium hover:opacity-90 transition-opacity text-sm"
          >
            Done
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

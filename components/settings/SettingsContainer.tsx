"use client";

import React, { useState, useEffect } from "react";
import { Shield, RefreshCw, Trash2, Cpu, CreditCard, Sparkles, AlertTriangle, Check, Loader2, Info } from "lucide-react";
import { usePrivacy } from "@/context/PrivacyContext";
import { SettingsSection } from "./SettingsSection";
import { useDashboard } from "@/hooks/useDashboard";
import { getStoredGeminiApiKey, getStoredGeminiModel, saveGeminiSettings, GEMINI_MODEL_OPTIONS } from "@/lib/ai-settings";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function SettingsContainer() {
  const { isPrivacyEnabled, togglePrivacy, hasHydrated } = usePrivacy();
  const { monthlyBudget, updateBudget, loading: dashboardLoading } = useDashboard();

  // Local state for API & Data resets
  const [isClearing, setIsClearing] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showWipeConfirm, setShowWipeConfirm] = useState(false);

  // Budget states
  const [budgetVal, setBudgetVal] = useState<string>("");
  const [isSavingBudget, setIsSavingBudget] = useState(false);
  const [budgetSuccess, setBudgetSuccess] = useState(false);

  // Gemini API states
  const [apiKey, setApiKey] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [isSavingGemini, setIsSavingGemini] = useState(false);
  const [geminiSuccess, setGeminiSuccess] = useState(false);

  // Load Gemini settings from localStorage on mount
  useEffect(() => {
    setApiKey(getStoredGeminiApiKey());
    setSelectedModel(getStoredGeminiModel());
  }, []);

  // Sync Monthly Budget state once query hydrats
  useEffect(() => {
    if (monthlyBudget !== undefined && monthlyBudget > 0) {
      setBudgetVal(monthlyBudget.toString());
    }
  }, [monthlyBudget]);

  const handleResetSession = () => {
    localStorage.removeItem("upi_session_id");
    window.location.reload();
  };

  const handleClearAllData = async () => {
    setIsClearing(true);
    try {
      const sessionId = localStorage.getItem("upi_session_id");
      if (sessionId) {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
        // FIXED path to call the designated /clear endpoint
        const response = await fetch(`${apiUrl}/api/session/clear`, {
          method: "DELETE",
          headers: { "X-Session-ID": sessionId }
        });
        if (!response.ok) throw new Error("Failed to clear server data");
      }
      localStorage.clear();
      window.location.reload();
    } catch (error) {
      console.error("Error clearing data:", error);
      alert("Failed to clear server data.");
    } finally {
      setIsClearing(false);
    }
  };

  const handleSaveBudget = async () => {
    const val = parseFloat(budgetVal);
    if (isNaN(val) || val < 0) return;
    setIsSavingBudget(true);
    try {
      await updateBudget(val);
      setBudgetSuccess(true);
      setTimeout(() => setBudgetSuccess(false), 2000);
    } catch (err) {
      console.error("Failed to save budget:", err);
    } finally {
      setIsSavingBudget(false);
    }
  };

  const handleSaveGemini = () => {
    setIsSavingGemini(true);
    try {
      saveGeminiSettings({ apiKey, model: selectedModel });
      setGeminiSuccess(true);
      setTimeout(() => setGeminiSuccess(false), 2000);
    } catch (err) {
      console.error("Failed to save Gemini settings:", err);
    } finally {
      setIsSavingGemini(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in zoom-in duration-300">
      
      {/* 1. Privacy & Security */}
      <SettingsSection 
        title="Privacy & Security" 
        description="Manage how your data is handled during this session."
        icon={Shield}
        iconClassName={isPrivacyEnabled ? "bg-accent/10 border-accent/20 text-accent" : "bg-foreground/5 border-border text-foreground/40"}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-foreground">Privacy Mode</p>
            <p className="text-xs text-foreground/40 font-sans mt-0.5">Mask sensitive names and transaction amounts in the UI.</p>
          </div>
          <button
            onClick={togglePrivacy}
            disabled={!hasHydrated}
            className={cn(
              "w-10 h-5.5 rounded-full relative transition-colors duration-300 outline-none cursor-pointer",
              isPrivacyEnabled ? "bg-accent" : "bg-white/10"
            )}
          >
            <motion.div 
              layout
              className="absolute top-1 left-1 w-3.5 h-3.5 bg-background rounded-full"
              animate={{ x: isPrivacyEnabled ? 18 : 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </button>
        </div>
      </SettingsSection>

      {/* 2. Monthly Budget Command */}
      <SettingsSection 
        title="Monthly Budget Control" 
        description="Set your monthly transaction limits. Updates will sync to database."
        icon={CreditCard}
        iconClassName="bg-teal/10 border-teal/20 text-teal"
      >
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex-1 space-y-1">
            <label className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest block">Monthly Limit (INR)</label>
            <input
              type="number"
              placeholder="e.g. 20000"
              className="w-full bg-white/5 border border-border/80 focus:border-teal/50 rounded-xl px-3.5 py-2 text-sm text-foreground outline-none transition-colors"
              value={budgetVal}
              onChange={(e) => setBudgetVal(e.target.value)}
            />
          </div>
          
          <button
            onClick={handleSaveBudget}
            disabled={isSavingBudget || dashboardLoading || !budgetVal}
            className={cn(
              "self-end px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all h-10 min-w-32 flex items-center justify-center gap-1.5 cursor-pointer",
              budgetSuccess
                ? "bg-teal/20 border border-teal/30 text-teal"
                : "bg-teal text-background hover:bg-teal/90 disabled:opacity-50"
            )}
          >
            {isSavingBudget ? (
              <Loader2 size={14} className="animate-spin" />
            ) : budgetSuccess ? (
              <>
                <Check size={14} />
                <span>Saved!</span>
              </>
            ) : (
              <span>Save Budget</span>
            )}
          </button>
        </div>
      </SettingsSection>

      {/* 3. Google Gemini API Engine */}
      <SettingsSection 
        title="Google Gemini AI Engine" 
        description="Configure your API key and model limits for natural language RAG parsing."
        icon={Cpu}
        iconClassName="bg-accent/10 border-accent/20 text-accent"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* API Key */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest block">Gemini API Key</label>
              <input
                type="password"
                placeholder="Enter Gemini API Key (stored locally)"
                className="w-full bg-white/5 border border-border/80 focus:border-accent/50 rounded-xl px-3.5 py-2 text-sm text-foreground outline-none transition-colors"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
            </div>
            
            {/* Model Selector */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest block">AI Model Routing</label>
              <select
                className="w-full bg-white/5 border border-border/80 focus:border-accent/50 rounded-xl px-3.5 py-2 text-sm text-foreground outline-none transition-colors cursor-pointer"
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
              >
                {GEMINI_MODEL_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-card text-foreground">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2 border-t border-border/30">
            <button
              onClick={handleSaveGemini}
              disabled={isSavingGemini || !selectedModel}
              className={cn(
                "px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all h-10 min-w-32 flex items-center justify-center gap-1.5 cursor-pointer",
                geminiSuccess
                  ? "bg-accent/20 border border-accent/30 text-accent"
                  : "bg-accent text-background hover:bg-accent/90"
              )}
            >
              {isSavingGemini ? (
                <Loader2 size={14} className="animate-spin" />
              ) : geminiSuccess ? (
                <>
                  <Check size={14} />
                  <span>Configured!</span>
                </>
              ) : (
                <span>Save AI Engine</span>
              )}
            </button>
          </div>
        </div>
      </SettingsSection>

      {/* 4. Data Management */}
      <SettingsSection 
        title="Data Management" 
        description="Control your data footprint, indexing layers, and session contexts."
        icon={Trash2}
        iconClassName="bg-destructive/10 border-destructive/20 text-destructive"
      >
        <div className="space-y-4">
          
          {/* Start New Session Trigger */}
          <div className="border border-border/40 rounded-xl overflow-hidden bg-panel/20">
            <button 
              onClick={() => {
                setShowResetConfirm(!showResetConfirm);
                setShowWipeConfirm(false);
              }}
              className="w-full flex items-center justify-between p-3.5 hover:bg-white/5 transition-all group outline-none"
            >
              <div className="flex items-center gap-3 text-foreground/60 group-hover:text-white transition-colors">
                <RefreshCw size={15} />
                <span className="text-xs font-bold uppercase tracking-wider">Start New Session</span>
              </div>
            </button>
            
            <AnimatePresence>
              {showResetConfirm && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="bg-amber-500/5 border-t border-amber-500/10 p-4 space-y-3"
                >
                  <p className="text-xs text-amber-200/70 font-sans flex items-start gap-2 leading-relaxed">
                    <AlertTriangle size={14} className="text-amber-400 shrink-0 mt-0.5" />
                    Starting a new session will clear your chat logs and generate a fresh session ID in your browser. Uploaded statements remain safe on the server.
                  </p>
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => setShowResetConfirm(false)}
                      className="px-3.5 py-1.5 bg-white/5 hover:bg-white/10 text-foreground/60 hover:text-white rounded-lg text-[10px] font-bold uppercase transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleResetSession}
                      className="px-3.5 py-1.5 bg-amber-500 text-background hover:bg-amber-600 rounded-lg text-[10px] font-bold uppercase transition-colors cursor-pointer"
                    >
                      Confirm Reset
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Clear All Data Trigger */}
          <div className="border border-destructive/25 rounded-xl overflow-hidden bg-destructive/[0.03]">
            <button 
              onClick={() => {
                setShowWipeConfirm(!showWipeConfirm);
                setShowResetConfirm(false);
              }}
              disabled={isClearing}
              className="w-full flex items-center justify-between p-3.5 hover:bg-destructive/10 transition-all group outline-none"
            >
              <div className="flex items-center gap-3 text-destructive font-bold transition-colors">
                {isClearing ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                <span className="text-xs font-bold uppercase tracking-wider">Clear All Data Permanently</span>
              </div>
            </button>
            
            <AnimatePresence>
              {showWipeConfirm && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="bg-destructive/5 border-t border-destructive/10 p-4 space-y-3"
                >
                  <p className="text-xs text-red-200/70 font-sans flex items-start gap-2 leading-relaxed">
                    <AlertTriangle size={14} className="text-destructive shrink-0 mt-0.5" />
                    CRITICAL: This permanently deletes ALL transaction statements, aggregate batches on the database, and wipes your settings. This action is irreversible.
                  </p>
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => setShowWipeConfirm(false)}
                      className="px-3.5 py-1.5 bg-white/5 hover:bg-white/10 text-foreground/60 hover:text-white rounded-lg text-[10px] font-bold uppercase transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleClearAllData}
                      className="px-3.5 py-1.5 bg-destructive text-white hover:bg-red-700 rounded-lg text-[10px] font-bold uppercase transition-colors cursor-pointer"
                    >
                      Confirm Permanent Wipe
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </SettingsSection>

      {/* Info Banner */}
      <div className="p-4 bg-accent/5 border border-accent/10 rounded-xl flex gap-3">
        <Info size={18} className="text-accent shrink-0" />
        <p className="text-xs text-foreground/40 leading-relaxed font-sans font-medium">
          Your financial statements are parsed, securely masked, and fully scoped to your browser session ID. 
          Executing a permanent data wipe clears all server statement indexing layers and database tables.
        </p>
      </div>
    </div>
  );
}

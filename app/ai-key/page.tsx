"use client";

import React, { useState, useEffect } from "react";
import { 
  Key, 
  Cpu, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  Save, 
  ShieldCheck, 
  ExternalLink,
  ChevronRight,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  getStoredGeminiApiKey, 
  getStoredGeminiModel, 
  saveGeminiSettings, 
  GEMINI_MODEL_OPTIONS 
} from "@/lib/ai-settings";
import { cn } from "@/lib/utils";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function AIKeyPage() {
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");

  useEffect(() => {
    setApiKey(getStoredGeminiApiKey());
    setModel(getStoredGeminiModel());
  }, []);

  const handleSave = () => {
    setIsSaving(true);
    setSaveStatus("idle");
    
    try {
      saveGeminiSettings({ apiKey, model });
      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch (err) {
      console.error(err);
      setSaveStatus("error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="max-w-3xl mx-auto space-y-8 p-6"
    >
      {/* Header */}
      <motion.div variants={item} className="space-y-2">
        <h1 className="text-3xl font-bold font-heading text-white tracking-tight">AI Settings</h1>
        <p className="text-zinc-500 font-sans">
          Configure your Gemini API access and model preferences.
        </p>
      </motion.div>

      {/* Main Settings Card */}
      <motion.div variants={item} className="bg-card border border-border rounded-2xl overflow-hidden shadow-xl shadow-black/20">
        <div className="p-8 space-y-8">
          
          {/* API Key Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                  <Key size={18} />
                </div>
                <h3 className="font-bold font-heading text-white">Gemini API Key</h3>
              </div>
              <a 
                href="https://aistudio.google.com/app/apikey" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-accent hover:underline flex items-center gap-1 font-medium font-sans"
              >
                Get API Key <ExternalLink size={12} />
              </a>
            </div>
            
            <div className="relative group">
              <input
                type={showKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your Gemini API key..."
                className="w-full bg-panel border border-border rounded-xl px-4 py-3.5 pr-12 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all font-mono text-sm"
              />
              <button
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
              >
                {showKey ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <p className="text-[11px] text-zinc-500 flex items-start gap-2 px-1">
              <ShieldCheck size={14} className="mt-0.5 text-teal" />
              Your key is stored locally in your browser and never sent to our servers. 
              We recommend using a restricted key for security.
            </p>
          </div>

          <div className="h-px bg-border" />

          {/* Model Selection */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-teal/10 flex items-center justify-center text-teal">
                <Cpu size={18} />
              </div>
              <h3 className="font-bold font-heading text-white">Inference Model</h3>
            </div>

            <div className="space-y-3">
              <div className="relative">
                <select
                  id="gemini-model"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full appearance-none bg-panel border border-border rounded-xl px-4 py-3.5 pr-12 focus:outline-none focus:ring-2 focus:ring-teal/50 transition-all font-sans text-sm text-white cursor-pointer"
                >
                  {GEMINI_MODEL_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value} className="bg-card text-white py-2">
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                  <ChevronRight size={18} className="rotate-90" />
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={model}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="p-4 bg-teal/5 border border-teal/10 rounded-xl flex gap-3"
                >
                  <Sparkles size={16} className="text-teal shrink-0 mt-0.5" />
                  <p className="text-xs text-zinc-400 leading-relaxed font-sans italic">
                    {GEMINI_MODEL_OPTIONS.find(o => o.value === model)?.description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-8 py-5 bg-panel/50 border-t border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AnimatePresence mode="wait">
              {saveStatus === "success" && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="flex items-center gap-2 text-teal text-sm font-medium"
                >
                  <CheckCircle2 size={16} />
                  Settings saved successfully
                </motion.div>
              )}
              {saveStatus === "error" && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="flex items-center gap-2 text-red-400 text-sm font-medium"
                >
                  <AlertCircle size={16} />
                  Failed to save settings
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2.5 bg-accent hover:bg-accent/90 text-white rounded-xl font-bold transition-all shadow-lg shadow-accent/20 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {isSaving ? (
              <Save className="w-4 h-4 animate-pulse" />
            ) : (
              <Save className="w-4 h-4 group-hover:scale-110 transition-transform" />
            )}
            <span>Save Settings</span>
          </button>
        </div>
      </motion.div>

      {/* Guide Card */}
      <motion.div variants={item} className="bg-teal/5 border border-teal/10 rounded-2xl p-6 flex gap-4">
        <div className="w-10 h-10 rounded-full bg-teal/10 flex items-center justify-center text-teal shrink-0">
          <ShieldCheck size={20} />
        </div>
        <div className="space-y-1">
          <h4 className="font-bold text-white font-heading">Privacy & Security</h4>
          <p className="text-sm text-zinc-400 font-sans leading-relaxed">
            Your API key is <span className="text-white font-medium">stored only in your browser's local storage</span>. 
            It is sent to our backend for processing but never saved on our servers. 
            You can remove your key at any time by clearing it here or by using the <span className="text-white font-medium">"Delete User Data"</span> option in the main Settings.
          </p>
          <button className="text-teal text-xs font-bold flex items-center gap-1 mt-2 hover:underline">
            View full configuration guide <ChevronRight size={14} />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

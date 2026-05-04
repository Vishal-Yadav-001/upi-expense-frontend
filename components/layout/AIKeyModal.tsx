"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { KeyRound, Sparkles, X } from "lucide-react";
import {
  GEMINI_MODEL_OPTIONS,
  getStoredGeminiApiKey,
  getStoredGeminiModel,
  saveGeminiSettings,
} from "@/lib/ai-settings";

interface AIKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIKeyModal = ({ isOpen, onClose }: AIKeyModalProps) => {
  const [model, setModel] = useState(() => getStoredGeminiModel());
  const [apiKey, setApiKey] = useState(() => getStoredGeminiApiKey());

  if (!isOpen || typeof document === "undefined") {
    return null;
  }

  const handleSave = () => {
    saveGeminiSettings({ apiKey, model });
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md bg-card border border-border rounded-3xl shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        <div className="flex items-center justify-between px-6 py-5 border-b border-border bg-card/50">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Bring Your Own AI Key</h2>
            <p className="text-[10px] text-foreground/30 uppercase tracking-widest font-bold mt-0.5">
              Gemini Settings
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close AI key modal"
            className="p-2 hover:bg-foreground/5 rounded-full transition-colors text-foreground/40 hover:text-foreground"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="p-4 bg-primary/5 rounded-xl flex gap-3 border border-primary/10">
            <Sparkles size={18} className="text-primary shrink-0" />
            <p className="text-xs text-foreground/60 leading-relaxed">
              Save your Gemini API key in this browser to keep chatting when the shared key is rate limited.
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="gemini-model" className="text-xs font-semibold uppercase tracking-widest text-foreground/40">
              Gemini Model
            </label>
            <select
              id="gemini-model"
              value={model}
              onChange={(event) => setModel(event.target.value)}
              className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              {GEMINI_MODEL_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label} - {option.description}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="gemini-api-key" className="text-xs font-semibold uppercase tracking-widest text-foreground/40">
              Gemini API Key
            </label>
            <div className="relative">
              <KeyRound size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/30" />
              <input
                id="gemini-api-key"
                type="password"
                value={apiKey}
                onChange={(event) => setApiKey(event.target.value)}
                placeholder="Paste your Gemini API key"
                className="w-full bg-background/50 border border-border rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
            <p className="text-xs text-foreground/45">
              Stored only in this browser. Leave blank if you want to keep using the shared default key.
            </p>
          </div>
        </div>

        <div className="px-6 py-4 bg-card/50 border-t border-border flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-border rounded-lg font-medium hover:bg-foreground/5 transition-colors text-sm"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 bg-primary text-background rounded-lg font-medium hover:opacity-90 transition-opacity text-sm"
          >
            Save
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

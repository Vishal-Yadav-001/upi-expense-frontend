"use client";

import { useState, useRef, useEffect } from "react";
import { useChat } from "@/hooks/useChat";
import { ChatMessage } from "./ChatMessage";
import { PDFUpload } from "./PDFUpload";
import { Send, Loader2, Shield, ShieldOff, Plus, X } from "lucide-react";
import { usePrivacy } from "@/context/PrivacyContext";
import { motion } from "framer-motion";

export const ChatPanel = () => {
  const [input, setInput] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  const { messages, sendMessage, loading } = useChat();
  const { isPrivacyEnabled, togglePrivacy } = usePrivacy();
  const [isMounted, setIsMounted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  if (!isMounted) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    sendMessage(input.trim());
    setInput("");
  };

  return (
    <div className="flex flex-col h-full bg-background border-r border-border w-full">
      <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-card/10">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-foreground/40">Chat Session</span>
          <button 
            onClick={() => setShowUpload(!showUpload)}
            className={`p-1.5 rounded-lg transition-colors ${showUpload ? "bg-primary text-background" : "hover:bg-card border border-border text-foreground/50"}`}
            title="Upload Statement"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 scroll-smooth"
      >
        {messages.length === 0 && !showUpload && (
          <div className="h-full flex flex-col items-center justify-center text-center p-8">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 text-primary">
              <Send size={32} />
            </div>
            <h2 className="text-xl font-bold mb-2">Welcome to UPI Sense</h2>
            <p className="text-foreground/50 max-w-xs mb-6">
              Ask me anything about your expenses. For example: &quot;How much did I spend on food last month?&quot;
            </p>
            <button 
              onClick={() => setShowUpload(true)}
              className="px-6 py-2.5 bg-primary text-background rounded-xl font-medium hover:opacity-90 transition-all flex items-center gap-2"
            >
              <Plus size={18} />
              Upload Statement to Start
            </button>
          </div>
        )}

        {showUpload && (
          <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold">Upload Statement</h3>
              <button onClick={() => setShowUpload(false)} className="text-foreground/40 hover:text-foreground">
                <X size={16} />
              </button>
            </div>
            <PDFUpload onUploadSuccess={() => setShowUpload(false)} />
          </div>
        )}
        {messages.map((m) => (
          <ChatMessage key={m.id} message={m} />
        ))}
        {loading && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3 mb-6"
          >
            <div className="w-8 h-8 rounded-lg bg-card border border-border text-primary flex items-center justify-center">
              <Loader2 size={18} className="animate-spin" />
            </div>
            <div className="bg-card border border-border rounded-2xl rounded-tl-none px-4 py-2.5 text-sm text-foreground/50 font-sans">
              Thinking...
            </div>
          </motion.div>
        )}
      </div>

      <div className="p-4 border-t border-border bg-card/30">
        <form onSubmit={handleSubmit} className="relative w-full">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question..."
            className="w-full bg-card border border-border rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm font-sans"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="absolute right-2 top-1.5 p-2 bg-primary text-background rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Send size={18} />
          </button>
        </form>
        <p className="text-[10px] text-center mt-3 text-foreground/30 uppercase tracking-widest font-medium">
          Powered by Gemini 2.0 Flash
        </p>
      </div>
    </div>
  );
};

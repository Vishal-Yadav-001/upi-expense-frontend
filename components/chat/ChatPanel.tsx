"use client";

import { useState, useRef, useEffect } from "react";
import { useChat } from "@/hooks/useChat";
import { ChatMessage } from "./ChatMessage";
import { Send, Loader2, Shield, ShieldOff } from "lucide-react";
import { usePrivacy } from "@/context/PrivacyContext";

export const ChatPanel = () => {
  const [input, setInput] = useState("");
  const { messages, sendMessage, loading } = useChat();
  const { isPrivacyEnabled, togglePrivacy } = usePrivacy();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    sendMessage(input.trim());
    setInput("");
  };

  return (
    <div className="flex flex-col h-full bg-background border-r border-border w-full max-w-2xl mx-auto">
      <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-card/10">
        <span className="text-xs font-semibold uppercase tracking-widest text-foreground/40">Chat Session</span>
        <button
          onClick={togglePrivacy}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
            isPrivacyEnabled 
              ? "bg-accent text-background" 
              : "bg-card border border-border text-foreground/50 hover:text-foreground"
          }`}
        >
          {isPrivacyEnabled ? (
            <>
              <Shield size={14} />
              Privacy On
            </>
          ) : (
            <>
              <ShieldOff size={14} />
              Privacy Off
            </>
          )}
        </button>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 scroll-smooth"
      >
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center p-8">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 text-primary">
              <Send size={32} />
            </div>
            <h2 className="text-xl font-bold mb-2">Welcome to UPI Sense</h2>
            <p className="text-foreground/50 max-w-xs">
              Ask me anything about your expenses. For example: &quot;How much did I spend on food last month?&quot;
            </p>
          </div>
        )}
        {messages.map((m) => (
          <ChatMessage key={m.id} message={m} />
        ))}
        {loading && (
          <div className="flex gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-card border border-border text-primary flex items-center justify-center">
              <Loader2 size={18} className="animate-spin" />
            </div>
            <div className="bg-card border border-border rounded-2xl px-4 py-2.5 text-sm text-foreground/50">
              Thinking...
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-border bg-card/30">
        <form onSubmit={handleSubmit} className="relative max-w-3xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question..."
            className="w-full bg-background border border-border rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
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

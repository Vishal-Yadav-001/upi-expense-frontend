"use client";

import { useState, useRef, useEffect } from "react";
import { useChat } from "@/hooks/useChat";
import { ChatMessage } from "./ChatMessage";
import { PDFUpload } from "./PDFUpload";
import { Send, Loader2, Plus, X, Paperclip, CloudUpload, Brain } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUI } from "@/context/UIContext";

export const ChatPanel = () => {
  const [input, setInput] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  const { messages, sendMessage, addSystemMessage, askSilentQuestion, loading } = useChat();
  const { isChatOpen } = useUI();
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

  const handleUploadSuccess = (data: { totalParsed?: number }) => {
    setShowUpload(false);
    const count = data?.totalParsed || 0;
    addSystemMessage(`✅ Statement Processed! Successfully imported ${count} transactions.`);
    askSilentQuestion("I just uploaded my statement. Please provide a 1-2 sentence summary including the total money spent and the time period covered by this statement.");
  };

  return (
    <AnimatePresence mode="wait">
      {isChatOpen && (
        <motion.div 
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 380, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className="flex flex-col h-full bg-background border-r border-border shrink-0 z-20 overflow-hidden"
        >
          <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-card/10 flex-shrink-0">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold uppercase tracking-widest text-foreground/40 font-heading">Chat Session</span>
              <button 
                onClick={() => setShowUpload(!showUpload)}
                className={`p-1.5 rounded-lg transition-colors ${showUpload ? "bg-accent text-background" : "hover:bg-card border border-border text-foreground/50"}`}
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
            <AnimatePresence mode="wait">
              {messages.length === 0 && !showUpload && (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="h-full flex flex-col items-center justify-center text-center p-8"
                >
                  <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mb-4 text-accent">
                    <Brain size={32} />
                  </div>
                  <h2 className="text-xl font-bold mb-2 font-heading">Welcome to UPI Sense</h2>
                  <p className="text-foreground/50 max-w-xs mb-6 text-sm">
                    Ask anything about your expenses. Your AI financial assistant is ready.
                  </p>
                  
                  <div className="flex flex-col gap-3 w-full max-w-xs">
                    {[
                      { icon: "🍔", text: "How much did I spend on food last month?" },
                      { icon: "📈", text: "Show my top spending categories" },
                      { icon: "📅", text: "What bills are due this week?" },
                      { icon: "💰", text: "How can I reduce my expenses?" }
                    ].map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => setInput(suggestion.text)}
                        className="flex items-center gap-3 p-3 text-left text-xs bg-card border border-border rounded-xl hover:border-accent/50 hover:bg-accent/5 transition-all text-foreground/70 font-sans group"
                      >
                        <span className="group-hover:scale-110 transition-transform">{suggestion.icon}</span>
                        {suggestion.text}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {showUpload && (
                <motion.div 
                  key="upload"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mb-8"
                >
                  <div className="flex items-center justify-between mb-3 px-2">
                    <h3 className="text-xs font-semibold uppercase tracking-widest text-foreground/40 font-heading">Upload Statement</h3>
                    <button onClick={() => setShowUpload(false)} className="text-foreground/40 hover:text-foreground transition-colors">
                      <X size={16} />
                    </button>
                  </div>
                  <PDFUpload onUploadSuccess={handleUploadSuccess} />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-6">
              {messages.map((m) => (
                <ChatMessage key={m.id} message={m} />
              ))}
            </div>
            
            {loading && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3 mt-6"
              >
                <div className="w-8 h-8 rounded-lg bg-card border border-border text-accent flex items-center justify-center">
                  <Loader2 size={18} className="animate-spin" />
                </div>
                <div className="bg-card border border-border rounded-2xl rounded-tl-none px-4 py-2.5 text-sm text-foreground/50 font-sans">
                  Thinking...
                </div>
              </motion.div>
            )}
          </div>

          <div className="p-4 border-t border-border bg-panel flex-shrink-0">
            {messages.length === 0 && !showUpload && (
              <motion.button 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => setShowUpload(true)}
                className="w-full mb-3 py-3 bg-accent text-background rounded-xl font-bold text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-accent/20"
              >
                <CloudUpload size={18} />
                Upload Statement to Start
              </motion.button>
            )}

            <form onSubmit={handleSubmit} className="relative flex items-center gap-2">
              <div className="relative flex-1 group">
                <button
                  type="button"
                  onClick={() => setShowUpload(!showUpload)}
                  className={`absolute left-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-all ${showUpload ? "bg-accent text-background" : "text-foreground/40 hover:text-foreground hover:bg-card"}`}
                  title="Upload File"
                >
                  <Paperclip size={18} />
                </button>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a question about your finances..."
                  className="w-full bg-card border border-border rounded-xl pl-11 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all text-sm font-sans"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-accent text-background rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <Send size={18} />
                </button>
              </div>
            </form>
            <p className="text-[10px] text-center mt-3 text-foreground/30 uppercase tracking-widest font-bold">
              Powered by Gemini
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

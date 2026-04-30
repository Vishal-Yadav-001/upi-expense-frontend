"use client";

import { Message } from "@/hooks/useChat";
import { motion } from "framer-motion";
import { User, Bot } from "lucide-react";
import { clsx } from "clsx";

export const ChatMessage = ({ message }: { message: Message }) => {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={clsx(
        "flex gap-3 mb-6",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      <div
        className={clsx(
          "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
          isUser ? "bg-primary text-background" : "bg-card border border-border text-primary"
        )}
      >
        {isUser ? <User size={18} /> : <Bot size={18} />}
      </div>
      <div
        className={clsx(
          "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
          isUser
            ? "bg-primary/10 text-foreground border border-primary/20"
            : "bg-card border border-border text-foreground/90"
        )}
      >
        {message.content}
      </div>
    </motion.div>
  );
};

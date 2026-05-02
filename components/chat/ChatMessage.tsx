"use client";

import { Message } from "@/hooks/useChat";
import { motion } from "framer-motion";
import { User, Bot } from "lucide-react";
import { clsx } from "clsx";
import { usePrivacy } from "@/context/PrivacyContext";

export const ChatMessage = ({ message }: { message: Message }) => {
  const isUser = message.role === "user";
  const { isPrivacyEnabled } = usePrivacy();

  const content = isPrivacyEnabled 
    ? message.content.replace(/₹\d+(?:,\d+)*(?:\.\d+)?/g, "₹****")
    : message.content;

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
          "max-w-[80%] px-4 py-2.5 text-sm leading-relaxed font-sans shadow-sm whitespace-pre-wrap",
          isUser
            ? "bg-primary text-primary-foreground rounded-2xl rounded-tr-none"
            : "bg-card border border-border text-foreground rounded-2xl rounded-tl-none"
        )}
      >
        {content.split(/(`[^`]+`)/g).map((part, i) => (
          part.startsWith("`") && part.endsWith("`") ? (
            <code key={i} className="font-mono bg-black/20 px-1.5 py-0.5 rounded text-xs">
              {part.slice(1, -1)}
            </code>
          ) : (
            part
          )
        ))}
      </div>
    </motion.div>
  );
};

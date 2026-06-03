"use client";

import React, { useState } from "react";
import { 
  MessageSquare, 
  Send, 
  Star, 
  CheckCircle2, 
  AlertCircle, 
  User,
  Heart,
  Sparkles,
  ArrowRight,
  Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation } from "@apollo/client/react";
import { SUBMIT_FEEDBACK } from "@/lib/queries";
import { useAuth } from "@clerk/nextjs";
import { cn } from "@/lib/utils";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0 }
};

export function FeedbackContainer() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const { userId } = useAuth();

  const [submitFeedback, { loading, error }] = useMutation(SUBMIT_FEEDBACK, {
    onCompleted: () => {
      setIsSuccess(true);
    },
  });

  const handleResetForm = () => {
    setIsSuccess(false);
    setName("");
    setMessage("");
    setRating(0);
    setHoverRating(0);
  };

  const isMessageValid = message.length === 0 || message.length >= 10;
  const hasFeedback = rating > 0 || message.length >= 10;
  const isSubmitDisabled = loading || !hasFeedback || !isMessageValid;

  // Compute dynamic action button text
  let submitButtonText = "Submit Feedback";
  if (loading) {
    submitButtonText = "Submitting...";
  } else if (!hasFeedback) {
    if (message.length > 0 && message.length < 10) {
      submitButtonText = "Write at least 10 characters...";
    } else {
      submitButtonText = "Provide a rating or message...";
    }
  } else if (!isMessageValid) {
    submitButtonText = "Write at least 10 characters...";
  } else if (rating > 0 && message.length >= 10) {
    submitButtonText = "Submit Rating & Feedback";
  } else if (rating > 0) {
    submitButtonText = "Submit Rating";
  } else {
    submitButtonText = "Submit Message";
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitDisabled) return;

    await submitFeedback({
      variables: {
        input: {
          sessionId: userId || "anonymous",
          message: message || undefined,
          rating: rating > 0 ? rating : undefined,
          context: JSON.stringify({
            name: name || "Anonymous",
            submittedAt: new Date().toISOString(),
            userAgent: typeof window !== "undefined" ? navigator.userAgent : "unknown",
          }),
        },
      },
    });
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      <AnimatePresence mode="wait">
        {isSuccess ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative bg-teal-soft/20 border border-teal/20 backdrop-blur-md rounded-3xl p-10 flex flex-col items-center text-center space-y-6 overflow-hidden shadow-xl shadow-teal/5"
          >
            {/* Soft background ambient glow */}
            <div className="absolute -top-12 -left-12 w-32 h-32 bg-teal/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-accent/10 rounded-full blur-2xl pointer-events-none" />

            {/* Elastic Spring Draw Checkmark Container */}
            <div className="relative w-20 h-20 bg-teal/10 text-teal border border-teal/30 rounded-full flex items-center justify-center shadow-lg shadow-teal/10">
              <svg className="w-10 h-10 text-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <motion.path
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>

              {/* Glowing Confetti Sparks */}
              {Array.from({ length: 8 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1.5 h-1.5 rounded-full bg-teal"
                  initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
                  animate={{
                    x: Math.cos((i * 45 * Math.PI) / 180) * 35,
                    y: Math.sin((i * 45 * Math.PI) / 180) * 35,
                    scale: [0, 1.2, 0],
                    opacity: [1, 1, 0]
                  }}
                  transition={{
                    duration: 1.2,
                    ease: "easeOut",
                    delay: 0.4
                  }}
                />
              ))}
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold font-heading text-white tracking-tight">Feedback Received!</h2>
              <p className="text-foreground/60 max-w-sm font-sans text-xs leading-relaxed">
                Thank you for helping us polish UPI Sense. Your insights and telemetry help refine our intelligence engines.
              </p>
            </div>

            <button
              onClick={handleResetForm}
              className="flex items-center gap-2 px-5 py-2.5 bg-teal text-background hover:bg-teal/90 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-teal/20"
            >
              Send another message
              <ArrowRight size={14} />
            </button>
          </motion.div>
        ) : (
          <motion.div 
            key="form"
            variants={item} 
            className="bg-card/40 border border-border/50 backdrop-blur-md rounded-2xl overflow-hidden shadow-xl"
          >
            <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
              
              {/* Name & Rating Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name Field */}
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-accent-soft text-accent border border-accent/20 flex items-center justify-center">
                      <User size={14} />
                    </div>
                    <label htmlFor="name-input" className="text-xs font-bold font-heading text-foreground/80 tracking-wide cursor-pointer">
                      Your Name
                    </label>
                  </div>
                  <input
                    id="name-input"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Optional (defaults to Anonymous)"
                    className="w-full bg-panel/50 border border-border/60 rounded-xl px-4 py-3 focus:outline-none focus:border-accent/50 focus:shadow-[0_0_15px_-3px_rgba(108,127,255,0.15)] transition-all font-sans text-xs text-foreground placeholder:text-foreground/20"
                  />
                </div>

                {/* Rating Field */}
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-teal-soft text-teal border border-teal/20 flex items-center justify-center">
                      <Star size={14} />
                    </div>
                    <label className="text-xs font-bold font-heading text-foreground/80 tracking-wide cursor-pointer">
                      Overall Rating
                    </label>
                  </div>
                  <div className="flex gap-1.5 bg-panel/30 p-1.5 rounded-xl border border-border/50 w-fit" onMouseLeave={() => setHoverRating(0)}>
                    {[1, 2, 3, 4, 5].map((star) => {
                      const isActive = (hoverRating > 0 ? hoverRating : rating) >= star;
                      return (
                        <motion.button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.9 }}
                          transition={{ type: "spring", stiffness: 400, damping: 15 }}
                          aria-label={`Rate ${star} out of 5 stars`}
                          className={cn(
                            "p-1.5 rounded-lg transition-colors cursor-pointer outline-none",
                            isActive 
                              ? "text-teal drop-shadow-[0_0_6px_rgba(46,232,181,0.35)]" 
                              : "text-foreground/10 hover:text-foreground/30"
                          )}
                        >
                          <Star 
                            size={20} 
                            fill={isActive ? "currentColor" : "none"} 
                            strokeWidth={2}
                          />
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="h-px bg-border/40" />

              {/* Message Field */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-accent-soft text-accent border border-accent/20 flex items-center justify-center">
                      <Heart size={14} />
                    </div>
                    <label htmlFor="message-input" className="text-xs font-bold font-heading text-foreground/80 tracking-wide cursor-pointer">
                      Your Message
                    </label>
                  </div>
                </div>
                
                <textarea
                  id="message-input"
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us what you like, what's broken, or what features you'd love to see..."
                  className={cn(
                    "w-full bg-panel/50 border rounded-xl px-4 py-3 focus:outline-none transition-all font-sans text-xs text-foreground placeholder:text-foreground/20 resize-none",
                    message.length > 0 && message.length < 10 
                      ? "border-amber-500/30 focus:border-amber-500/50" 
                      : "border-border/60 focus:border-accent/50 focus:shadow-[0_0_15px_-3px_rgba(108,127,255,0.15)]"
                  )}
                />

                {/* Progress bar / warning indicator */}
                {message.length > 0 && (
                  <div className="flex justify-between items-center mt-1 text-[10px] animate-in fade-in slide-in-from-top-1 duration-200">
                    <span className={cn(
                      "transition-colors font-medium flex items-center gap-1",
                      message.length < 10 ? "text-amber-400" : "text-teal font-bold"
                    )}>
                      {message.length < 10 ? (
                        <>
                          <AlertCircle size={10} />
                          Please enter at least 10 characters for meaningful text feedback.
                        </>
                      ) : (
                        "Feedback length is optimal!"
                      )}
                    </span>
                    <span className={cn(
                      "font-sans transition-all px-1.5 py-0.5 rounded text-[9px] font-bold border",
                      message.length < 10 
                        ? "text-amber-400 bg-amber-500/5 border-amber-500/10" 
                        : "text-teal bg-teal-soft/10 border-teal/20"
                    )}>
                      {message.length} / 10
                    </span>
                  </div>
                )}
              </div>

              {error && (
                <div className="p-3 bg-destructive-soft border border-destructive/20 rounded-xl flex gap-2 items-center text-destructive text-xs animate-in slide-in-from-top-2 duration-300">
                  <AlertCircle size={15} className="shrink-0" />
                  <p className="font-sans">Oops! Something went wrong while saving your feedback. Please try again.</p>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitDisabled}
                  className={cn(
                    "w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-lg cursor-pointer disabled:cursor-not-allowed",
                    isSubmitDisabled
                      ? "bg-white/5 border border-border/40 text-foreground/20 shadow-none"
                      : "bg-accent hover:bg-accent/90 text-background shadow-accent/15 hover:shadow-accent/25 hover:-translate-y-0.5 group"
                  )}
                >
                  {loading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <>
                      <Send size={14} className={cn(
                        "transition-transform",
                        !isSubmitDisabled && "group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      )} />
                      <span>{submitButtonText}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Community Card */}
      <motion.div variants={item} className="bg-teal-soft/5 border border-teal/15 rounded-2xl p-5 flex gap-4">
        <div className="w-9 h-9 rounded-full bg-teal-soft border border-teal/20 flex items-center justify-center text-teal shrink-0">
          <Sparkles size={16} />
        </div>
        <div className="space-y-1">
          <h4 className="font-bold text-white font-heading text-xs">Join the conversation</h4>
          <p className="text-[11px] text-foreground/40 font-sans leading-relaxed">
            Want to see what others are saying or contribute to our roadmap? Check out our 
            <span className="text-foreground/80 font-medium"> GitHub Discussions</span> or follow us on Twitter for real-time updates.
          </p>
          <div className="flex gap-4 mt-2.5">
            <a 
              href="https://github.com/gemini-added-memories/upi-sense"
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal hover:text-teal/80 text-[10px] font-bold flex items-center gap-1 hover:underline cursor-pointer transition-colors"
            >
              GitHub Repo <ArrowRight size={12} />
            </a>
            <a 
              href="https://github.com/gemini-added-memories/upi-sense/milestones"
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal hover:text-teal/80 text-[10px] font-bold flex items-center gap-1 hover:underline cursor-pointer transition-colors"
            >
              Feature Roadmap <ArrowRight size={12} />
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

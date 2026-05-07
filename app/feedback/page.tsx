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
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation } from "@apollo/client/react";
import { SUBMIT_FEEDBACK } from "@/lib/queries";
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

export default function FeedbackPage() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState<number>(0);
  const [isSuccess, setIsSuccess] = useState(false);

  const [submitFeedback, { loading, error }] = useMutation(SUBMIT_FEEDBACK, {
    onCompleted: () => {
      setIsSuccess(true);
      // Reset form after success
      setName("");
      setMessage("");
      setRating(0);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message || loading) return;

    await submitFeedback({
      variables: {
        input: {
          sessionId: typeof window !== "undefined" ? localStorage.getItem("upi_session_id") || "anonymous" : "anonymous",
          message,
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
      className="max-w-3xl mx-auto space-y-8 p-6"
    >
      {/* Header */}
      <motion.div variants={item} className="space-y-2 text-center md:text-left">
        <h1 className="text-3xl font-bold font-heading text-white tracking-tight flex items-center gap-3 justify-center md:justify-start">
          <MessageSquare className="text-accent w-8 h-8" />
          Share Your Feedback
        </h1>
        <p className="text-zinc-500 font-sans max-w-xl">
          Help us build the best financial companion. Your insights, suggestions, and reports help us improve UPI Sense for everyone.
        </p>
      </motion.div>

      {/* Success State or Form */}
      <AnimatePresence mode="wait">
        {isSuccess ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-accent/10 border border-accent/20 rounded-3xl p-12 flex flex-col items-center text-center space-y-6 shadow-2xl shadow-accent/5"
          >
            <div className="w-20 h-20 bg-accent text-white rounded-full flex items-center justify-center shadow-lg shadow-accent/20">
              <CheckCircle2 size={40} />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold font-heading text-white">Message Received!</h2>
              <p className="text-zinc-400 max-w-sm font-sans">
                Thank you for your valuable feedback. Our team will review it as we work on the next set of updates.
              </p>
            </div>
            <button
              onClick={() => setIsSuccess(false)}
              className="flex items-center gap-2 px-6 py-2.5 bg-accent hover:bg-accent/90 text-white rounded-xl font-bold transition-all"
            >
              Send another message
              <ArrowRight size={18} />
            </button>
          </motion.div>
        ) : (
          <motion.div 
            key="form"
            variants={item} 
            className="bg-card border border-border rounded-2xl overflow-hidden shadow-xl shadow-black/20"
          >
            <form onSubmit={handleSubmit} className="p-8 space-y-8">
              
              {/* Name & Rating Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Name Field */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                      <User size={18} />
                    </div>
                    <h3 className="font-bold font-heading text-white">Your Name</h3>
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Optional"
                    className="w-full bg-panel border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all font-sans text-sm"
                  />
                </div>

                {/* Rating Field */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-teal/10 flex items-center justify-center text-teal">
                      <Star size={18} />
                    </div>
                    <h3 className="font-bold font-heading text-white">Overall Rating</h3>
                  </div>
                  <div className="flex gap-2 bg-panel p-2 rounded-xl border border-border w-fit">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={cn(
                          "p-2 rounded-lg transition-all",
                          rating >= star 
                            ? "text-teal drop-shadow-[0_0_8px_rgba(46,232,181,0.4)]" 
                            : "text-zinc-700 hover:text-zinc-500"
                        )}
                      >
                        <Star 
                          size={24} 
                          fill={rating >= star ? "currentColor" : "none"} 
                          strokeWidth={2}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="h-px bg-border" />

              {/* Message Field */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                    <Heart size={18} />
                  </div>
                  <h3 className="font-bold font-heading text-white">Your Message</h3>
                </div>
                <textarea
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us what you like, what's broken, or what features you'd love to see..."
                  className="w-full bg-panel border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all font-sans text-sm resize-none"
                />
              </div>

              {error && (
                <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-xl flex gap-3 items-center text-red-400 text-sm animate-shake">
                  <AlertCircle size={20} className="shrink-0" />
                  <p>Oops! Something went wrong while sending your feedback. Please try again.</p>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading || !message}
                  className="w-full flex items-center justify-center gap-3 py-4 bg-accent hover:bg-accent/90 text-white rounded-xl font-bold transition-all shadow-lg shadow-accent/20 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      <span>Submit Your Feedback</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Community Card */}
      <motion.div variants={item} className="bg-teal/5 border border-teal/10 rounded-2xl p-6 flex gap-4">
        <div className="w-10 h-10 rounded-full bg-teal/10 flex items-center justify-center text-teal shrink-0">
          <Sparkles size={20} />
        </div>
        <div className="space-y-1">
          <h4 className="font-bold text-white font-heading">Join the conversation</h4>
          <p className="text-sm text-zinc-400 font-sans leading-relaxed">
            Want to see what others are saying or contribute to our roadmap? Check out our 
            <span className="text-white font-medium"> GitHub Discussions</span> or follow us on Twitter for real-time updates.
          </p>
          <div className="flex gap-4 mt-3">
            <button className="text-teal text-xs font-bold flex items-center gap-1 hover:underline">
              GitHub Repo <ArrowRight size={14} />
            </button>
            <button className="text-teal text-xs font-bold flex items-center gap-1 hover:underline">
              Feature Roadmap <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, Send, Star, CheckCircle2, AlertCircle } from "lucide-react";
import { useMutation } from "@apollo/client/react";
import { SUBMIT_FEEDBACK } from "@/lib/queries";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FeedbackModal = ({ isOpen, onClose }: FeedbackModalProps) => {
  const [mounted, setMounted] = useState(false);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState<number>(0);
  const [isSuccess, setIsSuccess] = useState(false);

  const [submitFeedback, { loading, error }] = useMutation(SUBMIT_FEEDBACK, {
    onCompleted: () => {
      setIsSuccess(true);
      setTimeout(() => {
        handleClose();
      }, 2000);
    },
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleClose = () => {
    onClose();
    // Reset state after transition
    setTimeout(() => {
      setName("");
      setMessage("");
      setRating(0);
      setIsSuccess(false);
    }, 300);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message) return;

    await submitFeedback({
      variables: {
        input: {
          sessionId: localStorage.getItem("upi_session_id") || "anonymous",
          message,
          rating: rating > 0 ? rating : undefined,
          context: JSON.stringify({
            name: name || "Anonymous",
            submittedAt: new Date().toISOString(),
          }),
        },
      },
    });
  };

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-md animate-in fade-in duration-300"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md max-h-[90vh] flex flex-col bg-card border border-border rounded-3xl shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        <div className="flex items-center justify-between px-6 py-5 border-b border-border bg-card/50">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Feedback</h2>
            <p className="text-[10px] text-foreground/30 uppercase tracking-widest font-bold mt-0.5">We'd love to hear from you</p>
          </div>
          <button 
            onClick={handleClose}
            aria-label="Close feedback"
            className="p-2 hover:bg-foreground/5 rounded-full transition-colors text-foreground/40 hover:text-foreground"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-4 text-center animate-in fade-in zoom-in duration-300">
              <div className="w-16 h-16 bg-secondary/10 text-secondary rounded-full flex items-center justify-center">
                <CheckCircle2 size={32} />
              </div>
              <div>
                <h3 className="text-lg font-bold">Thank You!</h3>
                <p className="text-sm text-foreground/60">Your feedback has been submitted successfully.</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div className="space-y-2">
                <label htmlFor="name" className="text-xs font-semibold uppercase tracking-widest text-foreground/40">
                  Your Name (Optional)
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="How should we call you?"
                  className="w-full px-4 py-3 bg-background/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all text-sm"
                />
              </div>

              {/* Message Field */}
              <div className="space-y-2">
                <label htmlFor="message" className="text-xs font-semibold uppercase tracking-widest text-foreground/40">
                  Message
                </label>
                <textarea
                  id="message"
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us what's on your mind..."
                  className="w-full px-4 py-3 bg-background/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all text-sm resize-none"
                />
              </div>

              {/* Rating Field */}
              <div className="space-y-3">
                <label className="text-xs font-semibold uppercase tracking-widest text-foreground/40">
                  Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`p-2 rounded-lg transition-all ${
                        rating >= star 
                          ? "bg-primary/10 text-primary scale-110" 
                          : "bg-foreground/5 text-foreground/20 hover:text-foreground/40"
                      }`}
                    >
                      <Star 
                        size={20} 
                        fill={rating >= star ? "currentColor" : "none"} 
                      />
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <div className="p-3 bg-destructive/5 border border-destructive/10 rounded-lg flex gap-2 items-center text-destructive text-xs">
                  <AlertCircle size={14} />
                  <p>Failed to submit feedback. Please try again.</p>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading || !message}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-background rounded-xl font-bold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send size={18} />
                      <span>Submit Feedback</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

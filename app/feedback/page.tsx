import { FeedbackContainer } from "@/components/feedback/FeedbackContainer";
import { MessageSquare } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Share Feedback | UPI Sense",
  description: "Help us build the best financial companion. Share your insights, bug reports, and feedback with the UPI Sense team.",
};

export default function FeedbackPage() {
  return (
    <div className="h-full overflow-y-auto p-6 space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-accent/10 text-accent rounded-xl border border-accent/20">
          <MessageSquare size={22} />
        </div>
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground font-heading">Share Your Feedback</h2>
          <p className="text-[10px] text-foreground/40 font-bold uppercase tracking-[0.2em]">Help us build the best financial companion</p>
        </div>
      </div>
      
      <div className="max-w-3xl">
        <FeedbackContainer />
      </div>
    </div>
  );
}

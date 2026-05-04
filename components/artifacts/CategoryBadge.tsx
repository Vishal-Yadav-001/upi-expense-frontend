"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Utensils, ShoppingBag, Truck, Zap, Film, Heart, ArrowRightLeft, Landmark, User, HelpCircle, Loader2 } from "lucide-react";
import { useMutation } from "@apollo/client/react";
import { CATEGORIZE_PAYEE } from "@/lib/queries";

const CATEGORIES = [
  { id: "Food & Dining", icon: Utensils, color: "text-orange-400" },
  { id: "Shopping", icon: ShoppingBag, color: "text-blue-400" },
  { id: "Travel", icon: Truck, color: "text-green-400" },
  { id: "Utilities", icon: Zap, color: "text-yellow-400" },
  { id: "Entertainment", icon: Film, color: "text-purple-400" },
  { id: "Health", icon: Heart, color: "text-red-400" },
  { id: "Transfer", icon: ArrowRightLeft, color: "text-gray-400" },
  { id: "Investments", icon: Landmark, color: "text-emerald-400" },
  { id: "Personal Care", icon: User, color: "text-pink-400" },
  { id: "Other", icon: HelpCircle, color: "text-slate-400" },
];

interface CategoryBadgeProps {
  payeeId: string;
  category: string;
  transactionCount: number;
}

export const CategoryBadge = ({ payeeId, category, transactionCount }: CategoryBadgeProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [categorizePayee, { loading }] = useMutation(CATEGORIZE_PAYEE);

  const isUncategorized = category === "UNCATEGORIZED";

  const handleSelect = async (newCategory: string) => {
    try {
      await categorizePayee({ 
        variables: { payeeId, category: newCategory },
        // Apollo cache will update automatically because we return id and category
      });
      setIsOpen(false);
    } catch (e) {
      console.error("[CategoryBadge] Error categorizing payee:", e);
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        disabled={loading}
        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full transition-all flex items-center gap-1.5 group ${
          isUncategorized 
            ? "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20" 
            : "bg-muted text-foreground/60 hover:bg-muted/80"
        } ${loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      >
        {loading ? <Loader2 size={10} className="animate-spin" /> : (category || "Uncategorized")}
        <ChevronDown size={10} className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="absolute left-0 mt-2 w-48 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden"
            >
              <div className="p-2 grid grid-cols-1 gap-1">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleSelect(cat.id)}
                    className="flex items-center gap-2.5 px-3 py-2 hover:bg-muted rounded-lg transition-colors text-left group"
                  >
                    <cat.icon size={14} className={cat.color} />
                    <span className="text-xs font-medium text-foreground/80">{cat.id}</span>
                  </button>
                ))}
              </div>
              {transactionCount > 0 && (
                <div className="px-3 py-2 bg-muted/50 border-t border-border flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-primary animate-pulse" />
                  <span className="text-[9px] font-bold uppercase tracking-tight text-foreground/40">
                    Updates {transactionCount} transactions
                  </span>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

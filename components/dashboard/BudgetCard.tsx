"use client";

import React, { useState, useEffect } from "react";
import { PieChart, Pencil, Check, X, Target } from "lucide-react";
import { usePrivacy } from "@/context/PrivacyContext";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface BudgetCardProps {
  budget: number;
  spent: number;
  onUpdate: (amount: number) => Promise<void>;
}

export const BudgetCard = ({ budget, spent, onUpdate }: BudgetCardProps) => {
  const { isPrivacyEnabled, hasHydrated } = usePrivacy();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(budget.toString());
  const [isSaving, setIsSaving] = useState(false);

  // Update editValue when budget prop changes only if not currently editing
  React.useEffect(() => {
    if (!isEditing) {
      setEditValue(budget.toString());
    }
  }, [budget, isEditing]);

  const maskValue = (val: number) => {
    if (!isPrivacyEnabled || !hasHydrated) return `₹${val.toLocaleString('en-IN')}`;
    return "₹" + val.toLocaleString('en-IN').replace(/\d/g, "*");
  };

  const progress = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;
  const isOverBudget = spent > budget;

  const getProgressColor = () => {
    const percent = budget > 0 ? (spent / budget) * 100 : 0;
    if (percent >= 100) return "bg-red-500";
    if (percent >= 80) return "bg-amber-500";
    return "bg-teal";
  };

  const handleSave = async () => {
    const newBudget = parseFloat(editValue);
    if (isNaN(newBudget) || newBudget < 0) return;
    
    setIsSaving(true);
    try {
      await onUpdate(newBudget);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update budget:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") setIsEditing(false);
  };

  return (
    <div className={cn(
      "relative overflow-hidden rounded-xl bg-card border border-border p-5 transition-all hover:border-border/40",
      "border-t-2 border-t-teal shadow-[0_-1px_10px_-4px_rgba(46,232,181,0.5)]"
    )}>
      {/* Background Icon */}
      <div className="absolute -right-2 -bottom-2 text-foreground/[0.03]" aria-hidden="true">
        <Target size={100} strokeWidth={1} />
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-heading font-bold uppercase tracking-widest text-foreground/50">
            Monthly Budget
          </span>
          <div className="p-2 rounded-lg bg-white/[0.03] border border-white/[0.05] text-teal">
            <PieChart size={16} />
          </div>
        </div>

        <div className="space-y-4">
          <AnimatePresence mode="wait">
            {!isEditing ? (
              <motion.div 
                key="display"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="flex items-center justify-between"
              >
                <div className="flex items-baseline gap-1">
                  <h3 className="text-2xl font-heading font-bold text-foreground">
                    {maskValue(spent)}
                  </h3>
                  <span className="text-sm text-foreground/40 font-medium">
                    / {maskValue(budget)}
                  </span>
                </div>
                <button 
                  onClick={() => setIsEditing(true)}
                  className="p-1.5 rounded-md hover:bg-white/5 text-foreground/40 hover:text-foreground transition-colors"
                >
                  <Pencil size={14} />
                </button>
              </motion.div>
            ) : (
              <motion.div 
                key="edit"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="flex items-center gap-2"
              >
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40 text-sm">₹</span>
                  <input 
                    autoFocus
                    type="number"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isSaving}
                    className="w-full bg-white/5 border border-white/10 rounded-lg py-1.5 pl-7 pr-3 text-sm focus:outline-none focus:border-teal/50 transition-colors"
                  />
                </div>
                <div className="flex gap-1">
                  <button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="p-1.5 rounded-md bg-teal/10 text-teal hover:bg-teal/20 transition-colors disabled:opacity-50"
                  >
                    <Check size={14} />
                  </button>
                  <button 
                    onClick={() => setIsEditing(false)}
                    disabled={isSaving}
                    className="p-1.5 rounded-md bg-white/5 text-foreground/40 hover:text-foreground transition-colors disabled:opacity-50"
                  >
                    <X size={14} />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-1.5">
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className={cn("h-full transition-colors duration-500", getProgressColor())}
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-medium text-foreground/30 uppercase tracking-tight">
                {isOverBudget ? "Budget Exceeded" : `${Math.round(progress)}% of budget used`}
              </span>
              {isOverBudget && (
                <span className="text-[10px] font-bold text-red-500 uppercase">
                  +₹{(spent - budget).toLocaleString('en-IN')}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

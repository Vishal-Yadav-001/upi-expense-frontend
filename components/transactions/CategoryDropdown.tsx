"use client";

import React, { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { ChevronDown, Search, Plus, Check, Loader2, X } from "lucide-react";
import { GET_AVAILABLE_CATEGORIES, UPDATE_PAYEE_CATEGORY } from "@/lib/queries";
import { cn } from "@/lib/utils";

interface CategoryDropdownProps {
  payeeId: string;
  currentCategory: string;
  className?: string;
}

export const CategoryDropdown = ({ payeeId, currentCategory, className }: CategoryDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [search, setSearch] = useState("");
  const [customValue, setCustomValue] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data } = useQuery(GET_AVAILABLE_CATEGORIES);
  const [updateCategory, { loading: updating }] = useMutation(UPDATE_PAYEE_CATEGORY, {
    refetchQueries: ["GetDashboardData", "GetAvailableCategories"],
  });

  const categories: string[] = data?.availableCategories || [];
  
  const filteredCategories = categories.filter(cat => 
    cat.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsCustomMode(false);
        setSearch("");
        setCustomValue("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = async (category: string) => {
    if (!category || !category.trim()) return;
    try {
      await updateCategory({
        variables: { payeeId, category: category.trim().toUpperCase() },
      });
      setIsOpen(false);
      setIsCustomMode(false);
      setSearch("");
      setCustomValue("");
    } catch (err) {
      console.error("Failed to update category:", err);
    }
  };

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={updating}
        className={cn(
          "flex items-center gap-1.5 px-2 py-0.5 rounded-md border transition-all text-xs",
          isOpen 
            ? "bg-accent/10 border-accent/30 text-accent" 
            : "bg-white/5 border-white/5 text-foreground/60 hover:bg-white/10 hover:border-white/10"
        )}
      >
        {updating ? <Loader2 size={12} className="animate-spin" /> : currentCategory}
        <ChevronDown size={12} className={cn("transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-48 bg-card border border-border rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in duration-150">
          {!isCustomMode ? (
            <>
              <div className="p-2 border-b border-border/50 flex items-center gap-2 bg-panel/30">
                <Search size={14} className="text-foreground/30" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Search category..."
                  className="bg-transparent border-none outline-none text-xs w-full text-foreground placeholder:text-foreground/20"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="max-h-48 overflow-auto py-1 custom-scrollbar">
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => handleSelect(cat)}
                      className="w-full text-left px-3 py-2 text-xs hover:bg-white/5 flex items-center justify-between group"
                    >
                      <span className={cn(
                        cat.toUpperCase() === currentCategory.toUpperCase() ? "text-teal font-bold" : "text-foreground/70"
                      )}>
                        {cat}
                      </span>
                      {cat.toUpperCase() === currentCategory.toUpperCase() && <Check size={12} className="text-teal" />}
                    </button>
                  ))
                ) : (
                  <div className="px-3 py-4 text-center text-[10px] text-foreground/30 italic">
                    No matching categories
                  </div>
                )}

                <button
                  onClick={() => setIsCustomMode(true)}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-teal/10 text-teal flex items-center gap-2 border-t border-border/30 mt-1"
                >
                  <Plus size={14} />
                  <span>Other...</span>
                </button>
              </div>
            </>
          ) : (
            <div className="p-3 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-wider">Custom Category</span>
                <button onClick={() => setIsCustomMode(false)} className="text-foreground/20 hover:text-white">
                  <X size={14} />
                </button>
              </div>
              <input
                autoFocus
                type="text"
                placeholder="Enter category name"
                className="w-full bg-white/5 border border-border rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-teal/50"
                value={customValue}
                onChange={(e) => setCustomValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSelect(customValue);
                  if (e.key === "Escape") setIsCustomMode(false);
                }}
              />
              <div className="flex gap-2">
                <button
                  onClick={() => setIsCustomMode(false)}
                  className="flex-1 py-2 bg-white/5 text-foreground/60 rounded-lg text-[10px] font-bold hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSelect(customValue)}
                  disabled={!customValue.trim() || updating}
                  className="flex-[2] py-2 bg-teal text-black font-bold rounded-lg text-[10px] hover:bg-teal/90 disabled:opacity-50 transition-colors"
                >
                  {updating ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

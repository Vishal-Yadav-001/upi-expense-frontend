"use client";

import React, { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { ChevronDown, Search, Plus, Check, Loader2 } from "lucide-react";
import { GET_AVAILABLE_CATEGORIES, UPDATE_PAYEE_CATEGORY } from "@/lib/queries";
import { cn } from "@/lib/utils";

interface CategoryDropdownProps {
  payeeId: string;
  currentCategory: string;
  className?: string;
}

export const CategoryDropdown = ({ payeeId, currentCategory, className }: CategoryDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data, loading } = useQuery(GET_AVAILABLE_CATEGORIES);
  const [updateCategory, { loading: updating }] = useMutation(UPDATE_PAYEE_CATEGORY, {
    refetchQueries: ["GetDashboardData", "GetAvailableCategories"],
  });

  const categories: string[] = data?.availableCategories || [];
  
  const filteredCategories = categories.filter(cat => 
    cat.toLowerCase().includes(search.toLowerCase())
  );

  const showAddOption = search && !categories.some(cat => cat.toLowerCase() === search.toLowerCase());

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = async (category: string) => {
    try {
      await updateCategory({
        variables: { payeeId, category: category.toUpperCase() },
      });
      setIsOpen(false);
      setSearch("");
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
          <div className="p-2 border-b border-border/50 flex items-center gap-2 bg-panel/30">
            <Search size={14} className="text-foreground/30" />
            <input
              autoFocus
              type="text"
              placeholder="Search or add..."
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
                    cat === currentCategory ? "text-teal font-bold" : "text-foreground/70"
                  )}>
                    {cat}
                  </span>
                  {cat === currentCategory && <Check size={12} className="text-teal" />}
                </button>
              ))
            ) : !showAddOption && (
              <div className="px-3 py-4 text-center text-[10px] text-foreground/30 italic">
                No categories found
              </div>
            )}

            {showAddOption && (
              <button
                onClick={() => handleSelect(search)}
                className="w-full text-left px-3 py-2 text-xs hover:bg-teal/10 text-teal flex items-center gap-2 border-t border-border/30 mt-1"
              >
                <Plus size={14} />
                <span>Add "{search}"</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

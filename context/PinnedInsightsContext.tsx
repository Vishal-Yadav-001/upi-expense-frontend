"use client";
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

export type PinnedChartType = "monthly_spend" | "category_spend" | "velocity";

export interface PinnedInsight {
  id: string;
  type: PinnedChartType;
  label: string;
  data: any[];
  pinnedAt: number;
}

interface PinnedInsightsContextType {
  pinnedInsights: PinnedInsight[];
  pinInsight: (type: PinnedChartType, label: string, data: any[]) => void;
  unpinInsight: (id: string) => void;
  isDataPinned: (type: PinnedChartType, data: any[]) => boolean;
}

const STORAGE_KEY = "upi-sense-pinned-insights";

const PinnedInsightsContext = createContext<PinnedInsightsContextType | undefined>(undefined);

export function PinnedInsightsProvider({ children }: { children: ReactNode }) {
  const [pinnedInsights, setPinnedInsights] = useState<PinnedInsight[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setPinnedInsights(JSON.parse(stored));
      }
    } catch {
      // Ignore parse errors
    }
    setHydrated(true);
  }, []);

  // Persist to localStorage on changes (only after hydration)
  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pinnedInsights));
    }
  }, [pinnedInsights, hydrated]);

  const pinInsight = useCallback((type: PinnedChartType, label: string, data: any[]) => {
    const newPin: PinnedInsight = {
      id: crypto.randomUUID(),
      type,
      label,
      data,
      pinnedAt: Date.now(),
    };
    setPinnedInsights((prev) => [...prev, newPin]);
  }, []);

  const unpinInsight = useCallback((id: string) => {
    setPinnedInsights((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const isDataPinned = useCallback((type: PinnedChartType, data: any[]) => {
    return pinnedInsights.some(
      (p) => p.type === type && JSON.stringify(p.data) === JSON.stringify(data)
    );
  }, [pinnedInsights]);

  return (
    <PinnedInsightsContext.Provider value={{ pinnedInsights, pinInsight, unpinInsight, isDataPinned }}>
      {children}
    </PinnedInsightsContext.Provider>
  );
}

export function usePinnedInsights() {
  const context = useContext(PinnedInsightsContext);
  if (context === undefined) {
    throw new Error("usePinnedInsights must be used within a PinnedInsightsProvider");
  }
  return context;
}

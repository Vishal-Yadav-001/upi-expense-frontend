"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

const PRIVACY_STORAGE_KEY = "upi_privacy_enabled";
const DEFAULT_PRIVACY_ENABLED = true;

interface PrivacyContextType {
  hasHydrated: boolean;
  isPrivacyEnabled: boolean;
  setPrivacyEnabled: (next: boolean) => void;
  togglePrivacy: () => void;
}

const PrivacyContext = createContext<PrivacyContextType | undefined>(undefined);

export const PrivacyProvider = ({ children }: { children: ReactNode }) => {
  const [hasHydrated, setHasHydrated] = useState(false);
  const [isPrivacyEnabled, setIsPrivacyEnabledState] = useState(DEFAULT_PRIVACY_ENABLED);

  useEffect(() => {
    const saved = window.localStorage.getItem(PRIVACY_STORAGE_KEY);
    if (saved !== null) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsPrivacyEnabledState(saved === "true");
    }
    setHasHydrated(true);
  }, []);

  const updatePrivacyEnabled = (next: boolean | ((current: boolean) => boolean)) => {
    setIsPrivacyEnabledState((current) => {
      const resolvedNext = typeof next === "function" ? next(current) : next;
      window.localStorage.setItem(PRIVACY_STORAGE_KEY, String(resolvedNext));
      return resolvedNext;
    });
  };

  const setPrivacyEnabled = (next: boolean) => {
    updatePrivacyEnabled(next);
  };

  const togglePrivacy = () => {
    updatePrivacyEnabled((prev) => !prev);
  };

  return (
    <PrivacyContext.Provider value={{ hasHydrated, isPrivacyEnabled, setPrivacyEnabled, togglePrivacy }}>
      {children}
    </PrivacyContext.Provider>
  );
};

export const usePrivacy = () => {
  const context = useContext(PrivacyContext);
  if (context === undefined) {
    throw new Error("usePrivacy must be used within a PrivacyProvider");
  }
  return context;
};
